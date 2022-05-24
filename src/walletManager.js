const ethers = require('ethers');
const nftAbi = require('./abi/NFT.json');

const TESTNET = {
    method: 'wallet_addEthereumChain',
    params: [{
        chainId: '0x13881',
        chainName: 'Polygon Testnet',
        nativeCurrency: {
            name: 'Polygon',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
    }]
};

const MAINNET = {
    method: 'wallet_addEthereumChain',
    params: [{
        chainId: '0x89',
        chainName: 'Matic Mainnet',
        nativeCurrency: {
            name: 'Polygon',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/']
    }]
}

class _walletManager {
    // status
    // null     => not connected
    // false    => trying to connect
    // true     => connect

    walletStatus = false;
    web3Global = false;
    ethers = ethers;

    nftAddr = "0xbcAE3e2893722698535aaf355F0aA92CA846354F";

    constructor() {
        this.connectToMetamask();

        this.connectToContract();
    }

    async connectToMetamask() {
        let err = "";
        if (window.ethereum) {
            this.web3Global = new ethers.providers.Web3Provider(window.ethereum);
            try {
                await window.ethereum.enable();
                this.walletStatus = true;
            } catch (error) {
                err = error;
            }
        } else {
            this.web3Global = new ethers.providers.JsonRpcProvider(MAINNET.params[0].rpcUrls[0]);
            err = "Metamask not found!";
        }

        if (window.ethereum) {
            await window.ethereum.request(MAINNET).catch((error) => {
                this.walletStatus = false;
                err = error;
            });

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                // params: [{ chainId: '0x89' }], // Polygon Mainnet
                params: [{ chainId: '0x13881' }], // Polygon Testnet
            }).catch((error) => {
                this.walletStatus = false;
                err = error;
            });
        }

        return err;
    }

    async connectToContract() {
        if (!this.nft) {
            this.nft = new ethers.Contract(this.nftAddr, nftAbi.abi, this.web3Global);
        }
    }

    async checkId() {
        let network = await this.web3Global.getNetwork();
        if (network.chainId != MAINNET.params[0].chainId) {
            await this.connectToMetamask();
        }
    }

    getStatus() {
        return this.walletStatus
    }
}

const walletManager = {
    install(Vue, options) {
        Vue.prototype.walletManager = new _walletManager();
    }
}

export default walletManager
