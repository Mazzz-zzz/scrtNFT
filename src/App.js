import './App.css';
import React, { useRef, useState, Component, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
var classNames = require('classnames');

const {
  BroadcastMode, EnigmaUtils, Secp256k1Pen, CosmWasmClient, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey, makeSignBytes, findSequenceForSignedTx
} = require("secretjs");

async function main() {    
  // connect to rest server
  const client = new CosmWasmClient("https://bootstrap.secrettestnet.io")
  // mainnet
  // const client = new CosmWasmClient("https://api.secretapi.io/")

  // query chain ID
  await client.getChainId()

  // query chain height
  await client.getHeight()

  // Get deployed code
  await client.getCodes()

  // Get the contracts for our simple counter
  const contracts = await client.getContracts(103)
  console.log(contracts);
  const contractAddress = contracts[0].address

  // Query the current count
  let response = await client.queryContractSmart(contractAddress, { "get_count": {}})

  console.log(`Count=${response.count}`)
}
//main();


function SetUpPreview (geo, renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer.setSize( window.innerWidth/2.2, window.innerHeight/2.2 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  camera.position.z = 150;
  //
  console.log(geo);
  //var geometry = loader.parse(res);
  var mesh = new THREE.Mesh(geo, material);
  scene.add(mesh);
  const box = new THREE.BoxHelper( mesh, 0xffff00 );
  scene.add( box );
  function animate() {
    requestAnimationFrame( animate );
  
    //scene.rotation.x += 0.01;
    scene.rotation.y += 0.01;
    
    renderer.render( scene, camera );
  }
  animate();
}




class NFTElement {
  constructor(name, owner, price, pubdata, tempurl) {
    this.name = name;
    this.owner = owner;
    this.price = price;
    this.tempurl = tempurl;
    var loader = new STLLoader();
    loader.load(tempurl, function (geometry) {
      this.pubdata = geometry;

    })
  }
  upload(privdata) {
    console.log("UploadHere");
  }

}
class NFTPreview extends React.Component {
  constructor(props) {
    super(props);
    this.url = props.url;
    console.log(this.url);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    var loader = new STLLoader();
    loader.load(this.url, function (geo) {
      console.log(geo)
      console.log("loaded?")
    });
    const renderer = new THREE.WebGLRenderer();
    this.myRef.current.appendChild(renderer.domElement);
  }

  render() {
    return <div ref={this.myRef}></div>
  }
}

function App() {
  var onChangeHandler= (event) => {
    var fileObject = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function ()
      {
        var loader = new STLLoader();
        var geometry = loader.parse(this.result);
        const renderer = new THREE.WebGLRenderer();
        cubeRef.current.appendChild(renderer.domElement)
        SetUpPreview(geometry, renderer)
      };
    reader.readAsArrayBuffer(fileObject)
  };

  //
  var openWindow = (event) => {
    if (event.target.innerText == "Help") {
      setHelpHid(false)
    }
    else if (event.target.innerText == "Upload") {
      setUploadHid(false)
    };
    setBackgroundInactive('BackgroundInactive')
  };
  var closeWindow = (event) => {
    setHelpHid(true);
    setUploadHid(true);
    setBackgroundInactive('');

  };
  let NFT1 = new NFTElement("test1", "0x0address1", "3 wETH", "","test1.stl");
  let NFT2 = new NFTElement("test2", "0x0address2", "9 wETH", "","test2.stl");
  const elements = [NFT1, NFT2];
  const [HelpHid, setHelpHid] = useState(true);
  const [UploadHid, setUploadHid] = useState(true);
  const [BackgroundInactive, setBackgroundInactive] = useState('');

  var HelpClass = classNames({
    PopupBase: true,
    hidden: HelpHid == true,
  });
  var UploadClass = classNames({
    PopupBase: true,
    hidden: UploadHid == true
  });
  const cubeRef = useRef(null);
  return (
    <div className="App">
      <div className={HelpClass}>
        <h2>What is this?</h2>
        <p>
          scrt NFT hub is an open source and a continuously evolving NFT platform that 
          aims to explore new ways of using and accessing Non-fungible tokens.
          <br></br><br></br>
          Initially the focus is for allowing visualisation and trading of files without 
          revealing their exact contents. This opens up the door to putting 3D files, art, music ect 
          onto the blockchain without ways to superficially duplicate them (ie you can't right click
          and save images) as the files displayed would either be hidden or a lower quality
          representation such as more pixelated images, noisy audio or 3D files represented as
          static images.
        </p>
        <br></br>
        <p>This project is currently a work in progress and a proof of concept 
          It currently only works with .stl 3D files, more filetypes will be supported in the future.
        </p>
        <p>
          Made with love By Mazzz
        </p>
        <a href="https://github.com/Mazzz-zzz/scrtNFT" i>
          <img src="GitHubLogo32px.png"></img>
        </a>
        <img className="closebtn" src="cancel.svg" onClick={closeWindow}></img>
      </div>
      <div className={UploadClass}>
        <h2>Upload NFT</h2>
        <p>Info about uploading</p>
        <input className="UpInput" type="file" name="file" onChange={onChangeHandler}/>
        <div ref={cubeRef} className="PreviewBox"></div>
        <img className="closebtn" src="cancel.svg" onClick={closeWindow}></img>
      </div>
      <div className={BackgroundInactive}>
        <header className="App-header">
          <h1>SCRT NFT HUB</h1>
        </header>
        <div className="NavBar">
          <div className="NavElem" onClick={openWindow}>
            Help
          </div>
          <div className="NavElem">
            Login
          </div>
          <div className="NavElem" onClick={openWindow}>
            Upload
          </div>
          <div className="NavElem">
            Switch
          </div>
        </div>
        <div className="NFTContainer">
          {elements.map((value, index) => {
            return (
            <div key={index} className="NFTElem">
              <div>{value.name}</div>
              <div>{value.owner}</div>
              <div>{value.price}</div>
              <NFTPreview url={value.tempurl}></NFTPreview>
            </div>
            )}
            )}
        </div>
      </div>
    </div>
  );
}
export default App;
