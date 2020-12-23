import './App.css';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Canvas, useFrame } from 'react-three-fiber';
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
main();



/*loader.load( './Rubber_Duck.stl', function ( geometry ) {
  const object = new THREE.Mesh( geometry, material );
  scene.add( object );
  const box = new THREE.BoxHelper( object, 0xffff00 );
  scene.add( box );
});
*/

/*function animate() {
  requestAnimationFrame( animate );

  //scene.rotation.x += 0.01;
  scene.rotation.y += 0.01;
  
	renderer.render( scene, camera );
}
animate();
*/


var onChangeHandler= (event) => {
  //
  var loader = new STLLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  camera.position.z = 150;
  //
  var fileObject = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function ()
    {
        var loader = new STLLoader();
        console.log(this.result);
        var geometry = loader.parse(this.result);
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var mesh = new THREE.Mesh(geometry, material);
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
    };
    
    reader.readAsArrayBuffer(fileObject)
  //



  /*loader.load( 'Rubber_Duck.stl', function ( geometry ) {
    const object = new THREE.Mesh( geometry, material );
    scene.add( object );
    const box = new THREE.BoxHelper( object, 0xffff00 );
    scene.add( box );
  });
  */
  

};



function App() {
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
  const elements = ['here', 'come', 'nfts', 'for', 'placeholder'];
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

  return (
    <div className="App">
      <div className={HelpClass}>
        <h2>What is this?</h2>
        <p>Insert stuff here</p>
        <img className="closebtn" src="cancel.svg" onClick={closeWindow}></img>
      </div>
      <div className={UploadClass}>
        <h2>Upload NFT</h2>
        <p>Info about uploading</p>
        <input className="UpInput" type="file" name="file" onChange={onChangeHandler}/>
        <div>Preview container</div>
        <img className="closebtn" src="cancel.svg" onClick={closeWindow}></img>
      </div>
      <div className={BackgroundInactive}>
        <header className="App-header">
          <h1>SCRT . FUN</h1>
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
            return <div className="NFTElem" key={index}>{value}</div>
          })}
        </div>
      </div>
    </div>
  );
}
export default App;
