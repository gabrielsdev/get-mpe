import { ethers } from "ethers";

const MPE_Faucet_ABI = require('./MPEFaucetABI.json');
const MPE_ABI = require('./MPEABI.json');

const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID);
const NAME_NETWORK = process.env.REACT_APP_NAME_NETWORK;
const MPE_FAUCET_ADDRESS = (process.env.REACT_APP_MPE_FAUCET_ADDRESS)?.toString() || "";

declare global {
    interface Window {
        ethereum:any;
    }
}

export default class Conn {
    private mpeFaucetSCConnected: any;
    private ethereum: any;
    private provider: any;
    private signer: any;

    constructor(){
        this.ethereum = window.ethereum;
    }

    public async connect() {
        try {
            await this.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.providers.Web3Provider(this.ethereum);
            this.signer = await this.provider.getSigner();
            let mpeFaucetSmartContract = new ethers.Contract(MPE_FAUCET_ADDRESS, MPE_Faucet_ABI, this.signer);
            this.mpeFaucetSCConnected = mpeFaucetSmartContract.connect(this.signer);
        } catch (error) {
            console.error(error);
        }
    }

    public getEthereum() {
        return this.ethereum;
    }

    public async checkWalletConnection() {
        return (await this.ethereum.request({ method: 'eth_accounts' })).length > 0 ? true : false;
    }

    public getProvider() {
        return this.provider;
    }

    public async isNetworkConnected(){
        if ((await this.provider.getNetwork()).chainId === CHAIN_ID) {
          return true;
        } else {
          return false;
        }
    }

    public getNameNetwork() {
        return NAME_NETWORK;
    }

    public async getAmount() {
        return await this.mpeFaucetSCConnected.amount();
    }

    public async isFaucetEnabled() {
        return await this.mpeFaucetSCConnected.isFaucetEnabled();
    }

    public async isAdmin() {
        return await this.mpeFaucetSCConnected.owner() === await this.signer.getAddress();
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
        await mpeTokenSCConnected.approve(MPE_FAUCET_ADDRESS, i*100);
    }

    public async depositMPE1(i: number) {
        await this.mpeFaucetSCConnected.depositMPE1(i*100);
    }

    public async approveDepositMPE2(i: number) {    
        let mpe2_address = await this.mpeFaucetSCConnected.MPE2();
        let mpeTokenSmartContract = new ethers.Contract(mpe2_address, MPE_ABI, this.signer);
        let mpeTokenSCConnected = mpeTokenSmartContract.connect(this.signer);
        await mpeTokenSCConnected.approve(MPE_FAUCET_ADDRESS, i*100);
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

    public async changeMPEs(newMPE1Address: string, newMPE2Address: string) {
        await this.mpeFaucetSCConnected.changeMPEs(newMPE1Address, newMPE2Address);
    }
}