import * as THREE from 'three';

class ThirdPersonCamera //must pass through camera in params
{
    constructor(params)
    {
        this._params= params
        this._camera = params.camera

        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
    }

    update(velocity=10)
    {
        const idealOffSet = this._CalculateIdealOffset(velocity);
        const idealLookAt = this._CalculateIdealLookat();

        this._currentPosition.copy(idealOffSet);
        this._currentLookAt.lerp(idealLookAt, 0.5);
        
        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookAt);

    }

    _CalculateIdealOffset(offset) {
        const idealOffset = new THREE.Vector3(0, 2, 10);
        idealOffset.applyQuaternion(this._params.target.quaternion);
        idealOffset.add(this._params.target.position);
        return idealOffset;
      }
    

    _CalculateIdealLookat() {
        const idealLookat = new THREE.Vector3(0, 0, -10);
        idealLookat.applyQuaternion(this._params.target.quaternion);
        idealLookat.add(this._params.target.position);
        return idealLookat;
      }


}

class FirstPersonCamera
{
    constructor(params)
    {
        this._params = params
        this._camera = this._params.camera
    }
}

export default ThirdPersonCamera;