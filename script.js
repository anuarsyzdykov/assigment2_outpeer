const contractAddress = "0x8a9B089b5a8d63b32fD81c869d965535d060585B";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_option",
				"type": "uint8"
			}
		],
		"name": "handThrow",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "option",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "result",
				"type": "uint8"
			}
		],
		"name": "HandThrown",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const provider = new ethers.providers.Web3Provider(window.ethereum, 97)//ChainID 97 BNBtestnet
let signer;
let contract;


const event = "HandThrown";

provider.send("eth_requestAccounts", []).then(()=>{
    provider.listAccounts().then( (accounts) => {
        signer = provider.getSigner(accounts[0]); //account in metamask
        
        contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        )
     
    }
    )
}
)

async function moveHand(_option){
    let amountInEth = document.getElementById("amountInEth").value;
    let amountInWei = ethers.utils.parseEther(amountInEth.toString())
    console.log(amountInWei);
    
    let resultOfAction = await contract.handThrow(_option, {value: amountInWei});
    const res = await resultOfAction.wait();
    console.log(res);
    //console.log( await res.events[0].args.player.toString());

    let queryResult =  await contract.queryFilter('HandThrown', await provider.getBlockNumber() - 10000, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
    //console.log(queryResult[queryResult.length-1].args);

    let amount = await queryResultRecent.args.amount.toString();
    let player = await queryResultRecent.args.player.toString();
    let option = await queryResultRecent.args.option.toString();
    let result = await queryResultRecent.args.result.toString();

    let resultLogs = `
    stake amount: ${ethers.utils.formatEther(amount.toString())} BNB, 
    player: ${player}, 
    player chose: ${option ==0 ? "HEAD": "TAIL"}, 
    result: ${result == false ? "LOSE 😥": "WIN 🎉"}`;
    console.log(resultLogs);

    let resultLog = document.getElementById("resultLog");
    resultLog.innerText = resultLogs;

    handleEvent();
}

async function handleEvent(){

    let queryResult =  await contract.queryFilter('HandThrown', await provider.getBlockNumber() - 10000, await provider.getBlockNumber());
    let queryResultRecent = queryResult[queryResult.length-1]
    let amount = await queryResultRecent.args.amount.toString();
    let player = await queryResultRecent.args.player.toString();
    let option = await queryResultRecent.args.option.toString();
    let result = await queryResultRecent.args.result.toString();

    let resultLogs = `
    stake amount: ${ethers.utils.formatEther(amount.toString())} BNB, 
    player: ${player}, 
    player chose: ${option ==0 ? "HEAD": "TAIL"}, 
    result: ${result == false ? "LOSE 😥": "WIN 🎉"}`;
    console.log(resultLogs);

    let resultLog = document.getElementById("resultLog");
    resultLog.innerText = resultLogs;
    
}







