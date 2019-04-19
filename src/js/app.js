App = {
  web3Provider: null,
  contracts: {},
  account:0x0,

  init: async function() {
   

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      //if a web3 interface is already provided by the metamask.
     // App.web3Provider = web3.currentProvider;
    // web3 = new Web3('http://localhost:7545');;//new Web3(web3.currentProvider);
    }else{
      // specify default interface if noweb3  instance is provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
     $.getJSON("Contest.json",function(contest){
      //initantiate a new Truffle contract from the artifact
      App.contracts.Contest = TruffleContract(contest);
      //connect provider to intract with contract
      App.contracts.Contest.setProvider(App.web3Provider);
     App.listenForEvent();
    return App.render();
    });
  },
listenForEvent: function(){
      App.contracts.Contest.deployed().then(function(instance){
        instance.VotedEvent({},{
          fromBlock :0,
          toBlock:'latest'
        }).watch(function(error,event){
          console.log("event triggered",event);
          //reload when vote is casted
          App.render();
        });
      });
},
  render: function(){
      var contestInstance;
      var loader = $('#loader');
      var content = $('#content');

      loader.show();
      content.hide();

      //load accc. data
      web3.eth.getCoinbase(function(err,account){
        if (err === null) {
         
          App.account = account;
           console.log('Appaccount :', account);
          $('#accountAddress').html('Your Account : '+account);
        }else{
          console.log('error: ',err);
        }
      });

     //  web3.eth.getAccounts(function(error, account) {
     //  if(error === null){
     //  console.log('account :',account[1]);
     //      App.account = account[1];

     //       $('#accountAddress').html('Your Account : '+account[1]);
     //    }
       
     // });
//}

//console.log('accc ',web3.eth.getAccounts(0) );
      //load contract data
      App.contracts.Contest.deployed().then(function(instance){
        contestInstance = instance;
        return contestInstance.contestantsCount();
      }).then(function(contestantsCount){
        var contestantsResults = $('#contestantsResults');
        contestantsResults.empty();
         
         var contestantsSelect = $('#contestantSelect');
        contestantsSelect.empty();

        for(var i =1;i<=contestantsCount;i++){
          contestInstance.contestants(i).then(function(contestant){
            var id = contestant[0];
            var name = contestant[1];
            var voteCount = contestant[2];

            //Render contest result
            var contestantTemplate = "<tr><th>" + id+ "</th><td>" +name+ "</td><td>"+voteCount+"</td></tr>";
            contestantsResults.append(contestantTemplate);

            //Render the candidate voting option
            var contestantOption = "<option value='"+id+"'>"+name+"</option>"
            contestantsSelect.append(contestantOption);

          });
        }
        loader.hide();
        content.show();
      }).catch(function(error){
        console.warn(error);
      });

},
  //};
// 
casteVote: function(){
  var contestantId = $('#contestantSelect').val(); 
  console.log('id',contestantId);
  App.contracts.Contest.deployed().then(function(instance){
    return instance.vote(contestantId,{from: App.account});
  }).then(function(result){
 $('#content').hide();
  $('#loader').show();

  }).catch(function(err){
    console.error(err);
  });

}
};
$(function() {
  $(window).load(function() {
    App.init();
  });
});
