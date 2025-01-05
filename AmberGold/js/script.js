const navMobile = document.querySelector('.nav-mobile')
const navBtn = document.querySelector('.hamburger')
const burgerBtnBars = document.querySelector('.hamburger-inner')
const allNavLinks = document.querySelectorAll('.nav__link')
const footerYear = document.querySelector('.footer__year')

const handleNav = () => {
    navMobile.classList.toggle('nav-mobile--active')
	navBtn.classList.toggle('is-active')

    allNavLinks.forEach(link => {
		link.addEventListener('click', () => {
			navMobile.classList.remove('nav-mobile--active')
			navBtn.classList.remove('is-active')
		})
	})

	handleNavLinksAnimation()
}

const handleNavLinksAnimation = () => {
	let delayTime = 0
	allNavLinks.forEach(link => {
		link.classList.toggle('nav-links-animation')
		link.style.animationDelay = '.' + delayTime + 's'
		delayTime++
	})
}

const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	footerYear.innerText = year  
}

handleCurrentYear()

navBtn.addEventListener('click',handleNav )