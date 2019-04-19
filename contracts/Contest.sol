pragma solidity 0.5.0;

//creating contract
contract Contest{


struct Contestant{
	uint id;
	string name;
	uint voteCount;

}
//dec. var.

//string public contestant;
//create constructor

// constructor() public {
// 	contestant = "Tom";
// }

// creating structure to model the content



//use mapping to get or fetch contestant detailss

mapping(uint=>Contestant) public contestants;

// to save the list of users who already voted.
mapping(address=>bool) public voters;

//add a public state var. to keep track of contestant
uint public contestantsCount;

event VotedEvent( uint indexed _contestantId);
 

constructor ( ) public{
   addContestant("Tom");
   addContestant("Jerry");
}


// add a fx. to add contestant
function addContestant(string memory _name) public {
	contestantsCount++;
	contestants[contestantsCount] = Contestant(contestantsCount,_name,0);
}
function vote (uint _contestantId) public {

	//restricting the voter to cast vote once
	require(!voters[msg.sender]);

	//require that the vote is casted to valid contestant
	require(_contestantId>0 && _contestantId <= contestantsCount);
	contestants[_contestantId].voteCount++;
	voters[msg.sender] = true;
	emit VotedEvent(_contestantId);
}

}