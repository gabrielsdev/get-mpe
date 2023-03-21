import { ethers } from "ethers";

const MPE_Faucet_ABI = require('./MPEFaucetABI.json');
const MPE_ABI = require('./MPEABI.json');

declare global {
    interface Window {
        ethereum:any;
    }
}

type Network = {
    name: string;
    chainId: number;
    faucetAddress: string;
}

const SEPOLIA: Network = {name: 'Sepolia', chainId: 11155111, faucetAddress: '0x62990C6B79eEEE53EB0DA3A0A680D8C4490b0301'}
const GOERLI: Network = {name: 'Goerli', chainId: 5, faucetAddress: '0xFE8bf228A21B77e1Eb1F10ebeFC206F35f2A0048'}

export default class Conn {
    private mpeFaucetSCConnected: any;
    private ethereum: any;
    private provider: any;
    private signer: any;
    private network: Network;

    constructor(){
        this.ethereum = window.ethereum;
    }

    public async connect() {
        try {
            await this.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.providers.Web3Provider(this.ethereum);
            this.signer = await this.provider.getSigner();
            let chainId = (await this.provider.getNetwork()).chainId;
            this.network = SEPOLIA;
            if(chainId === GOERLI.chainId){
                this.network = GOERLI;
            }            
            let mpeFaucetSmartContract = new ethers.Contract(this.network.faucetAddress, MPE_Faucet_ABI, this.signer);
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
        if ((await this.provider.getNetwork()).chainId === this.network.chainId) {
          return true;
        } else {
          return false;
        }
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
        await mpeTokenSCConnected.approve(this.network.faucetAddress, i*100);
    }

    public async depositMPE1(i: number) {
        await this.mpeFaucetSCConnected.depositMPE1(i*100);
    }

    public async approveDepositMPE2(i: number) {    
        let mpe2_address = await this.mpeFaucetSCConnected.MPE2();
        let mpeTokenSmartContract = new ethers.Contract(mpe2_address, MPE_ABI, this.signer);
        let mpeTokenSCConnected = mpeTokenSmartContract.connect(this.signer);
        await mpeTokenSCConnected.approve(this.network.faucetAddress, i*100);
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