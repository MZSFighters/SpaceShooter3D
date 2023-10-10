function health(name){
    const health = document.getElementById(name);

    const health_shrink = health.clientWidth*0.1;
    window.addEventListener('keydown', (event) => {
        if (event.key === 'l' || event.key === 'L') {
            const currentWidth = health.clientWidth;
            const newWidth = currentWidth - health_shrink;

            if (currentWidth <= 100) {
                health.style.backgroundColor = 'red';
            }

            if (currentWidth <= 0) {
                alert("Game Over");
            }
            health.style.width = `${newWidth}px`;
            
        }
    });
}


const rectangle = document.getElementById('sheld-bar');

    const reduction = rectangle.clientWidth*0.1;
    window.addEventListener('keydown', (event) => {
        if (event.key === 'l' || event.key === 'L') {
            const currentWidth = rectangle.clientWidth;
            const newWidth = currentWidth - reduction;

            if (currentWidth == 0) {
                health('health-bar');
            }
            rectangle.style.width = `${newWidth}px`;
            
        }
    });

