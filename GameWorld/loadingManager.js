import * as THREE from 'three';

// Create a centralized LoadingManager
const loadingManager = new THREE.LoadingManager();

// Progress function to track overall loading progress
const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	progressBar.value = (itemsLoaded/itemsTotal)*100;
};

const progressBarContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = function ( ) {
	progressBarContainer.style.display = 'none';
};

export default loadingManager;
