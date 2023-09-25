// Выбираем все элементы с классом 'col' и сохраняем их в переменную cols
const cols = document.querySelectorAll('.col')

// Добавляем обработчик события "keydown" для всего документа
document.addEventListener('keydown', (event) => {
  event.preventDefault() // Предотвращаем стандартное поведение клавиши
  if (event.code.toLowerCase() === 'space') {
    setRandomColors() // Если нажата клавиша "пробел", вызываем функцию setRandomColors()
  }
})

// Добавляем обработчик события "click" для всего документа
document.addEventListener('click', (event) => {
  const type = event.target.dataset.type // Получаем значение атрибута "data-type" элемента, по которому кликнули

  if (type === 'lock') {
    // Если значение "data-type" равно 'lock'
    const node =
      event.target.tagName.toLowerCase() === 'i'
        ? event.target
        : event.target.children[0]

    node.classList.toggle('fa-lock-open')
    node.classList.toggle('fa-lock')
  } else if (type === 'copy') {
    copyToClipboard(event.target.textContent) // Если значение "data-type" равно 'copy', копируем текст в буфер обмена
  }
})

// Функция для генерации случайного цвета в формате HEX
function generateRandomColor() {
  const hexCodes = '0123456789ABCDEF'
  let color = ''
  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
  }
  return '#' + color
}

// Функция для копирования текста в буфер обмена
function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

// Функция для установки случайных цветов в колонки (или восстановления сохраненных цветов)
function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : []

  cols.forEach((col, index) => {
    const isLocked = col.querySelector('i').classList.contains('fa-lock')
    const text = col.querySelector('h2')
    const button = col.querySelector('button')

    if (isLocked) {
      colors.push(text.textContent)
      return
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random()

    if (!isInitial) {
      colors.push(color)
    }

    text.textContent = color
    col.style.background = color

    setTextColor(text, color)
    setTextColor(button, color)
  })

  updateColorsHash(colors)
}

// Функция для установки цвета текста в зависимости от цвета фона
function setTextColor(text, color) {
  const luminance = chroma(color).luminance()
  text.style.color = luminance > 0.5 ? 'black' : 'white'
}

// Функция для обновления хэша в URL на основе массива цветов
function updateColorsHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1)
    })
    .join('-')
}

// Функция для получения массива цветов из хэша в URL
function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((color) => '#' + color)
  }
  return []
}

setRandomColors(true) // Вызываем функцию setRandomColors() с флагом true для инициализации цветов
