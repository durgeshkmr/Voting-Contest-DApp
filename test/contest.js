var Contest = artifacts.require("./Contest.sol");

contract("Contest",function(account){
	//to check if getting init correctly

	it('initalizes with two Contestants',function(){

        return Contest.deployed().then(function(instance){
        	return instance.contestantsCount();
        }).then(function(count){
        	assert.equal(count,2);
        });
	});

	it('it init the contestants with corrrect value',function(){
		return Contest.deployed().then(function(instance){
			contestInstance = instance;
			return contestInstance.contestants(1);
		}).then(function(contestant){
			assert.equal(contestant[0],1,'contains the corrrect id');
			assert.equal(contestant[1],'Tom','contains the corrrect name');
			assert.equal(contestant[2],0,'contains the corrrect votecount');
			return contestInstance.contestants(2);
		}).then(function(contestant){
			assert.equal(contestant[0],2,'contains the corrrect id');
			assert.equal(contestant[1],'Jerry','contains the corrrect name');
			assert.equal(contestant[2],0,'contains the corrrect votecount');
		});
	});
});