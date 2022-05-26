<template>
    <div class="page">
        <div class="mint">
            <h1>NFT Meetup Example</h1>
            <h3>NFT left : {{ nftLeft }}</h3>
            <button v-if="this.walletStatus" @click="getNFT()">
                <img src="/snowflake.svg" />
                Mint
            </button>
            <button v-else @click="connect()">Connect Wallet</button>
            <a href="https://opensea.io/collection/non-fungible-token-8">VIEW AN NFT ON OPENSEA</a>
        </div>
    </div>
</template>

<script>
export default {
    name: "Mint",
    data() {
        return {
            walletStatus: false,
            nftLeft: "0",
            loadNFT: false
        };
    },
    mounted() {
        setInterval(async () => {
            this.walletStatus = this.walletManager.walletStatus;

            if(!this.loadNFT) {
                this.loadNFT = true;
                this.loadNFTLeft();
            }
        }, 100);
    },
    methods: {
        async connect() {
            let err = await this.walletManager.connectToMetamask();
            if (err != "") {
                window.location = "https://metamask.app.link/dapp/nft-meetup-example.github.io";
            }
        },
        async getNFT() {
            let signer = await this.walletManager.web3Global.getSigner();
            let nftSigner = this.walletManager.nft.connect(signer);

            try {
                await nftSigner.mint({
                    // value: this.walletManager.ethers.utils.parseUnits('1', 'ether'),
                    value: this.walletManager.ethers.utils.parseUnits('25', 'ether'),
                    gasLimit: 150000
                });
            } catch (e) {
                console.log(e);    
            }
        },
        async loadNFTLeft() {
            await this.walletManager.checkId();
            setTimeout(async () => {
                let number = await this.walletManager.nft.totalSupply();
                this.nftLeft = 1024 - number;
            }, 1000);
        }
    }
};
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(255,255,255);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, Fira, Sans, "Droid Sans", "Helvetica Neue", sans-serif;
    min-height: 100vh;
}

.mint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(115,199,205);
    background: linear-gradient(134deg, rgba(115,199,205,1) 0%, rgba(63,69,255,1) 100%);
    color: white;
    box-shadow: 0px 9px 12px rgba(0, 0, 0, 0.44), 0px 1722px 482px rgba(255, 255, 255, 0.01), 0px 1102px 441px rgba(255, 255, 255, 0.04), 0px 620px 372px rgba(255, 255, 255, 0.15), 0px 276px 276px rgba(255, 255, 255, 0.26), 0px 13px 152px rgba(255, 255, 255, 0.29);
    width: 300px;
    padding: 30px;
}

.mint > h1 {
    text-align: center;
}

.mint > button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: transparent;
    color: white;
    border: 3px solid white;
    border-radius: 10px;
    font-size: 36px;
    margin-bottom: 20px;
    padding: 5px 40px;
}

.mint > button:hover {
    cursor: pointer;
}

.mint > a, .mint > a:hover, .mint > a:active {
    text-decoration: none;
    color: white;
}
</style>
