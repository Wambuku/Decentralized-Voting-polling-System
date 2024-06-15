import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Text "mo:base/Text";

actor class VotingCanister() = this {
  type Key = {
    hash: Nat;
    key: Text;
  };

  stable var polls: Trie.Trie<Key, Poll> = Trie.empty<Key, Poll>((x, y) -> Nat.compare(x.hash, y.hash));

  type Poll = {
    question: Text;
    options: [Text];
    votes: [Nat];  // Changed from [Int] to [Nat] to match the correct type
    creator: Principal;
  };

  type PollId = Key;

  public shared({caller}) func createPoll(question: Text, options: [Text]) : async PollId {
    assert(options.size() > 1);
    let pollId = { hash = Text.hash(question); key = question }; // Create a unique Key
    let poll = {
      question = question;
      options = options;
      votes = Array.tabulate<Nat>(options.size(), func (i) : Nat { 0 });
      creator = caller;
    };
    polls := Trie.put<Key, Poll>(polls, pollId, poll, (x, y) -> Nat.compare(x.hash, y.hash));
    return pollId;
  };

  public shared func vote(pollId: PollId, optionIndex: Nat) : async Bool {
    switch (Trie.find<Key, Poll>(polls, pollId, (x, y) -> Nat.compare(x.hash, y.hash))) {
      case (?poll) {
        if (optionIndex >= 0 and optionIndex < poll.options.size()) {
          let updatedVotes = Array.copy<Nat>(poll.votes);
          updatedVotes[optionIndex] := updatedVotes[optionIndex] + 1;
          let updatedPoll = { poll with votes = updatedVotes };
          polls := Trie.put<Key, Poll>(polls, pollId, updatedPoll, (x, y) -> Nat.compare(x.hash, y.hash));
          return true;
        };
        return false;
      };
      case null { return false; };
    }
  };

  public shared func getPoll(pollId: PollId) : async ?Poll {
    return Trie.find<Key, Poll>(polls, pollId, (x, y) -> Nat.compare(x.hash, y.hash));
  };
};
