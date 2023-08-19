const modal = document.querySelector('#modal')

export function showDivWithOpacityAnimation(target) {

    modal.style.display = 'block';
    requestAnimationFrame(function () {
        modal.style.opacity = '1';
        modal.appendChild(target)

        try {
            target.style.opacity = '1'
            target.style.pointerEvents = 'auto'
            console.log(target)
        } catch (error) {
          console.log(error)
        }
       
        
    });
}
export function hideDivWithOpacityAnimation() {
    const target = Array.from(modal.children)[0]

    setTimeout(function () {
        target.style.opacity = '0'
    }, 30); // Temps correspondant à la durée de transition CSS
    setTimeout(()=>{
        target.remove()
        modal.style.opacity = '0'
    },60)
    setTimeout(()=>{
        modal.style.display = 'none';
    },110)

}

