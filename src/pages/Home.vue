<template>
    <div class="mint">
        <h1>NFT Meetup Example</h1>
        <h3>NFT left : {{ nftLeft }}</h3>
        <p>Click on the snowflake and get the NFT</p>
        <button @click="getNFT()"></button>
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
            if(!this.walletStatus) {
                let err = await this.walletManager.connectToMetamask();
                console.log(err);
            }

            if(!this.loadNFT) {
                this.loadNFT = true;
                this.loadNFTLeft();
            }
        }, 100);
    },
    methods: {
        async getNFT() {
            let signer = await this.walletManager.web3Global.getSigner();
            let nftSigner = this.walletManager.nft.connect(signer);

            try {
                await nftSigner.mint({
                    // value: this.walletManager.ethers.utils.parseUnits('1', 'ether'),
                    value: this.walletManager.ethers.utils.parseUnits('10', 'finney'),
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
                this.nftLeft = 10000 - number;
            }, 1000);
        }
    }
};
</script>

<style scoped>
.mint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(255,255,255);
    background: linear-gradient(134deg, rgba(255,255,255,1) 0%, rgba(91,241,252,1) 50%, rgba(255,255,255,1) 100%);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, Fira, Sans, "Droid Sans", "Helvetica Neue", sans-serif;
    min-height: 100vh;
}

.mint > button {
    background: transparent;
    background-image: url('/snowflake.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border: 0;
    border-radius: 10px;
    font-size: 36px;
    padding: 70px;
}

.mint > button:hover {
    cursor: pointer;
}
</style>