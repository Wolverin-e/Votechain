// Votechain
pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract Votechain{
    
    struct Candidate{
        string name;
        uint256 votes;
    }
    
    address private deployer;
    string [] candidate_names;
    string private deployer_name;
    mapping (uint8 => Candidate) candidates;
    mapping (uint16 => bool) has_transferred;
    uint8 total_candidates;
    
    constructor(string memory _deployer_name) public{
        deployer = msg.sender;
        deployer_name = _deployer_name;
        total_candidates = 0;
    }
    
    function add_candidate(string memory _name) public{
        if(msg.sender != deployer) return;
        Candidate memory _candidate;
        _candidate.name = _name;
        _candidate.votes = 0;
        candidates[++total_candidates] = _candidate;
        candidate_names.push(_name);
    }
    
    function transfer_vote(uint16 _aid, uint8 _to) public{
        if(msg.sender != deployer) return;
        if(has_transferred[_aid]) return;
        has_transferred[_aid] = true;
        candidates[_to].votes++;
    }
    
    function get_votes(uint8 _from) view public returns (uint256){
        if(msg.sender == deployer) {
            if(_from <= total_candidates && _from > 0){
                return candidates[_from].votes;
            }
        }
        return 0;
    }
    
    function get_all_votes() view public returns (uint256 [] memory){
        uint256[] memory all_votes = new uint256[](total_candidates); 
        if(msg.sender == deployer){
            for(uint8 i=1; i<=total_candidates; i++){
                all_votes[i-1] = candidates[i].votes;
            }
        }
        return all_votes;
    }
    
    function has_voted(uint16 _aid) view public returns (bool){
        if(msg.sender == deployer){
            return has_transferred[_aid];
        }
        return true;
    }
    
    function get_total_candidates() view public returns (uint8){
        if(msg.sender == deployer){
            return total_candidates;
        }
        return 0;
    }
    
    
    function get_candidates() view public returns (string [] memory){
        if(msg.sender == deployer){
            return candidate_names;
        }
    }
    
}