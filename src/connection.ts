//require('dotenv').config()
import { ethers } from "ethers";

const MPE_Faucet_ABI = require('./MPEFaucetABI.json');
const MPE_ABI = require('./MPEABI.json');

var MPE_FAUCET_ADDRESS : string;

if (process.env.MPE_FAUCET_ADDRESS === undefined) {
    MPE_FAUCET_ADDRESS = "0x62990C6B79eEEE53EB0DA3A0A680D8C4490b0301";
}else{
    MPE_FAUCET_ADDRESS = process.env.MPE_FAUCET_ADDRESS;
}

//console.log(MPE_FAUCET_ADDRESS);

declare global {
    interface Window {
        ethereum:any;
    }
}

export default class Conn {
    private mpeFaucetAddress = MPE_FAUCET_ADDRESS;
    private mpeFaucetSCConnected: any;
    private ethereum: any;
    private signer: any;

    constructor(){
        this.ethereum = window.ethereum;
        try {
            this.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
        let provider = new ethers.providers.Web3Provider(this.ethereum);
        this.signer = provider.getSigner();
        let mpeFaucetSmartContract = new ethers.Contract(this.mpeFaucetAddress, MPE_Faucet_ABI, this.signer);
        this.mpeFaucetSCConnected = mpeFaucetSmartContract.connect(this.signer);
    }

    public getEthereum() {
        return this.ethereum;
    }

    public async getAmount() {
        return await this.mpeFaucetSCConnected.amount();
    }

    public async isFaucetEnabled() {
        return await this.mpeFaucetSCConnected.isFaucetEnabled();
    }

    public async isAdmin() {
        return await this.mpeFaucetSCConnected.owner() == await this.signer.getAddress();
    }

    public async obtainMPE1(i: number) {
        await this.mpeFaucetSCConnected.obtainMPE1(i*100);
    }

    public async obtainMPE2(i: number) {
        await this.mpeFaucetSCConnected.obtainMPE2(i*100);
    }

    public async approveDepositMPE1(i: number) {    
        let mpe1_address = await this.mpeFaucetSCConnected.MPE1();
        let mpeTokenSmartContract = new ethers.Contract(mpe1_address, MPE_ABI, this.signer);
        let mpeTokenSCConnected = mpeTokenSmartContract.connect(this.signer);
        await mpeTokenSCConnected.approve(this.mpeFaucetAddress, i*100);
    }

    public async depositMPE1(i: number) {
        await this.mpeFaucetSCConnected.depositMPE1(i*100);
    }

    public async approveDepositMPE2(i: number) {    
        let mpe2_address = await this.mpeFaucetSCConnected.MPE2();
        let mpeTokenSmartContract = new ethers.Contract(mpe2_address, MPE_ABI, this.signer);
        let mpeTokenSCConnected = mpeTokenSmartContract.connect(this.signer);
        await mpeTokenSCConnected.approve(this.mpeFaucetAddress, i*100);
    }

    public async depositMPE2(i: number) {
        await this.mpeFaucetSCConnected.depositMPE2(i*100);
    }

    public async setFaucetState(b: boolean) {
        await this.mpeFaucetSCConnected.setFaucetState(b);
    }

    public async setAmount(i: number) {
        await this.mpeFaucetSCConnected.setAmount(i*100);
    }
}