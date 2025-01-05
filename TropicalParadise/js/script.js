const burgerBtn = document.querySelector('.burger-btn')
const navBox = document.querySelector('.nav__box')
const allNavItems = document.querySelectorAll('.nav__item')
const burgerBtnBars = document.querySelector('.burger-btn__bars')
const allSections = document.querySelectorAll('.section')
const footerYear = document.querySelector('.footer__year')
//mail
const msgStatus = document.querySelector('.msg-status')


const handleNav = () => {
	navBox.classList.toggle('nav--active')
	burgerBtnBars.classList.remove('black-bars-color')

	allNavItems.forEach(item => {
		item.addEventListener('click', () => {
			navBox.classList.remove('nav--active')
		})
	})
	handleNavItemsAnimation()
}

const handleNavItemsAnimation = () => {
	let delayTime = 0
	allNavItems.forEach(item => {
		item.classList.toggle('nav-items-animation')
		item.style.animationDelay = '.' + delayTime + 's'
		delayTime++
	})
}

const handleObserver = () => {
	const currentSection = window.scrollY

	allSections.forEach(section => {
		//zapasz 60 px na white-block
		if (section.classList.contains('white-section') && section.offsetTop <= currentSection + 60) {
			burgerBtnBars.classList.add('black-bars-color')
		} else if (!section.classList.contains('white-section') && section.offsetTop <= currentSection + 60) {
			burgerBtnBars.classList.remove('black-bars-color')
		}
	})
}

const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	footerYear.innerText = year
}

handleCurrentYear()
burgerBtn.addEventListener('click', handleNav)
window.addEventListener('scroll', handleObserver)


//mail
if (document.location.search === '?mail_status=sent') {
	msgStatus.classList.add('success')
	msgStatus.textContent = 'Wiadomość wysłana'
	setTimeout(() => {
		msgStatus.classList.remove('msg-status--success')
	},3000)
}
if (document.location.search === '?mail_status=error') {
	msgStatus.classList.add('error')
	msgStatus.textContent = 'Wystąpił bład'
	setTimeout(() => {
		msgStatus.classList.remove('msg-status--error')
	},3000)
}
//mail
