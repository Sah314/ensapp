import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import {ethers,providers} from "ethers";
import {useEffect,useRef,useState} from "react";
export default function Home(){
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [ens, setEns] = useState("");
  const web3ModalRef = useRef();

const setENSOrAddress = async(address,web3Provider)=>{
  var _ens = await web3Provider.lookupAddress(address);

  if(_ens) {
    setEns(_ens);
  }
  else{
    setAddress(address);
  }
};

const getProviderOrSigner = async()=>{

  const provider  = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);
  const {chainId} = await web3Provider.getNetwork();
  if(chainId !==5){
    window.alert("Please change network to goerli");
    throw new Error("Change the network to Goerli");
  }
  const signer = web3Provider.getSigner();
  const address = await signer.getAddress();
  await setENSOrAddress(address,web3Provider);
  return signer;  
};

const connectWallet = async ()=>{
  try{
    await getProviderOrSigner(true);
    setWalletConnected(true);
  }
  catch(err){
console.error(err);
  }
};


const renderButton =()=>{
  if(walletConnected){
    <div>Wallet connected</div>;
  }
  else{
    return(
      <button onClick = {connectWallet} className={styles.button}>Connect your wallet</button>
    );
  }
};

useEffect(()=>{
  if(!walletConnected){
    web3ModalRef.current = new Web3Modal({
      network:"goerli",
      providerOptions:{},
      disableInjectedProvider:false,
    });
    connectWallet();
  }
},[walletConnected]);

return(
  <div>
    <Head>
      <title>
        ENS Dapp
      </title>
      <meta name="description" content="ENS-dapp"/>
      <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    </Head>
    <div className={styles.main}>
    <h1 className={styles.title}>
      Welcome! {ens?ens : address}	&#128519;
    </h1>
    <div className={styles.description}>
      It identifies your ENS username.
    </div>
    <div>
      {renderButton()}
    </div>
    <div>
  <img className={styles.image} src="./learnweb3punks.png" alt="not available" />
    </div>
    </div>
    <footer className={styles.footer}> Made with &#10084; by sahil314.eth </footer>
  </div>
 
);
}