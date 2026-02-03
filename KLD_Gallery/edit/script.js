// Получаем элементы DOM
const addArtBtn = document.getElementById('addArtBtn');
const removeArtBtn = document.getElementById('removeArtBtn');
const addForm = document.getElementById('addForm');
const removeForm = document.getElementById('removeForm');
const cancelBtn = document.getElementById('cancelBtn');
const cancelRemoveBtn = document.getElementById('cancelRemoveBtn');
const artworkForm = document.getElementById('artworkForm');
const removeArtworkForm = document.getElementById('removeArtworkForm');
const gallery = document.querySelector('.gallery');
const artistsGrid = document.querySelector('.artists-grid');

// Функция для проверки существования картины
function artworkExists(title, artistFullName) {
    const artworks = document.querySelectorAll('.artwork');
    for (let artwork of artworks) {
        const artworkTitle = artwork.getAttribute('data-title');
        const artworkArtist = artwork.getAttribute('data-artist');
        if (artworkTitle === title && artworkArtist === artistFullName) {
            return true;
        }
    }
    return false;
}

// Функция для проверки количества картин художника
function countArtistArtworks(artistFullName) {
    const artworks = document.querySelectorAll('.artwork');
    let count = 0;
    for (let artwork of artworks) {
        const artworkArtist = artwork.getAttribute('data-artist');
        if (artworkArtist === artistFullName) {
            count++;
        }
    }
    return count;
}

// Функция для удаления художника из списка
function removeArtistFromList(artistFullName) {
    const artistElements = document.querySelectorAll('.artist');
    for (let artistElement of artistElements) {
        if (artistElement.getAttribute('data-artist') === artistFullName) {
            artistElement.remove();
            break;
        }
    }
}

// Функция для установки обработчика ошибок изображений
function setImageErrorHandler(imgElement) {
    imgElement.onerror = function() {
        this.src = 'https://via.placeholder.com/400x250/5d1f24/ffffff?text=Изображение+не+загружено';
        this.alt = 'Изображение недоступно';
    };
}

// Функция для управления состоянием кнопок
function updateButtonsState(activeForm = null) {
    if (activeForm === 'add') {
        addArtBtn.classList.add('active');
        removeArtBtn.classList.remove('active');
        addArtBtn.disabled = true;
        removeArtBtn.disabled = false;
    } else if (activeForm === 'remove') {
        removeArtBtn.classList.add('active');
        addArtBtn.classList.remove('active');
        removeArtBtn.disabled = true;
        addArtBtn.disabled = false;
    } else {
        // Нет активной формы
        addArtBtn.classList.remove('active');
        removeArtBtn.classList.remove('active');
        addArtBtn.disabled = false;
        removeArtBtn.disabled = false;
    }
}

// Показываем форму добавления
addArtBtn.addEventListener('click', () => {
    addForm.style.display = 'block';
    removeForm.style.display = 'none';
    updateButtonsState('add');
    window.scrollTo({top: 0, behavior: 'smooth'});
});

// Показываем форму удаления
removeArtBtn.addEventListener('click', () => {
    removeForm.style.display = 'block';
    addForm.style.display = 'none';
    updateButtonsState('remove');
    window.scrollTo({top: 0, behavior: 'smooth'});
});

// Скрываем форму добавления
cancelBtn.addEventListener('click', () => {
    addForm.style.display = 'none';
    artworkForm.reset();
    updateButtonsState();
});

// Скрываем форму удаления
cancelRemoveBtn.addEventListener('click', () => {
    removeForm.style.display = 'none';
    removeArtworkForm.reset();
    updateButtonsState();
});

// Обработка отправки формы добавления
artworkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Получаем значения из формы
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const artworkTitle = document.getElementById('artworkTitle').value.trim();
    const artistLastName = document.getElementById('artistLastName').value.trim();
    const artistFirstName = document.getElementById('artistFirstName').value.trim();
    const artistBio = document.getElementById('artistBio').value.trim();
    
    // Проверяем, что все поля заполнены
    if (!imageUrl || !artworkTitle || !artistLastName || !artistFirstName || !artistBio) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
    }
    
    // Проверяем валидность URL
    try {
        new URL(imageUrl);
    } catch {
        alert('Пожалуйста, введите корректную ссылку на изображение!');
        return;
    }
    
    // Создаем элемент картины
    const fullName = `${artistFirstName} ${artistLastName}`;
    
    // Проверяем, существует ли уже такая картина
    if (artworkExists(artworkTitle, fullName)) {
        alert('Такая картина уже существует в галерее!');
        return;
    }
    
    // Добавляем картину в галерею
    const artworkElement = document.createElement('div');
    artworkElement.className = 'artwork';
    artworkElement.setAttribute('data-title', artworkTitle);
    artworkElement.setAttribute('data-artist', fullName);
    artworkElement.innerHTML = `
        <img src="${imageUrl}" alt="${artworkTitle}">
        <div class="artwork-info">
            <h3>${artworkTitle}</h3>
            <p class="artist">${fullName}</p>
        </div>
    `;
    
    gallery.appendChild(artworkElement);
    
    // Устанавливаем обработчик ошибок для нового изображения
    const newImg = artworkElement.querySelector('img');
    setImageErrorHandler(newImg);
    
    // Проверяем, существует ли уже такой художник
    const existingArtist = Array.from(artistsGrid.querySelectorAll('.artist'))
        .find(artist => artist.getAttribute('data-artist') === fullName);
    
    if (!existingArtist) {
        // Добавляем нового художника
        const artistElement = document.createElement('div');
        artistElement.className = 'artist';
        artistElement.setAttribute('data-artist', fullName);
        artistElement.innerHTML = `
            <h3>${fullName}</h3>
            <p>${artistBio}</p>
        `;
        artistsGrid.appendChild(artistElement);
    }
    
    // Очищаем форму и скрываем её
    artworkForm.reset();
    addForm.style.display = 'none';
    updateButtonsState();
    
    // Показываем сообщение об успехе
    alert(`Картина "${artworkTitle}" успешно добавлена в галерею!`);
    
    // Плавная прокрутка к новой картине
    setTimeout(() => {
        artworkElement.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        artworkElement.style.animation = 'highlight 2s ease';
    }, 100);
});

// Обработка отправки формы удаления
removeArtworkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Получаем значения из формы
    const removeArtworkTitle = document.getElementById('removeArtworkTitle').value.trim();
    const removeArtistLastName = document.getElementById('removeArtistLastName').value.trim();
    const removeArtistFirstName = document.getElementById('removeArtistFirstName').value.trim();
    const confirmText = document.getElementById('confirmText').value.trim();
    
    // Проверяем, что все поля заполнены
    if (!removeArtworkTitle || !removeArtistLastName || !removeArtistFirstName || !confirmText) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }
    
    // Проверяем подтверждение
    if (confirmText.toLowerCase() !== 'удалить') {
        alert('Для подтверждения удаления введите слово "удалить"');
        return;
    }
    
    const fullName = `${removeArtistFirstName} ${removeArtistLastName}`;
    
    // Ищем картину для удаления
    const artworks = document.querySelectorAll('.artwork');
    let artworkToRemove = null;
    
    for (let artwork of artworks) {
        const artworkTitle = artwork.getAttribute('data-title');
        const artworkArtist = artwork.getAttribute('data-artist');
        if (artworkTitle === removeArtworkTitle && artworkArtist === fullName) {
            artworkToRemove = artwork;
            break;
        }
    }
    
    if (!artworkToRemove) {
        alert('Картина с таким названием и автором не найдена!');
        return;
    }
    
    // Удаляем картину
    artworkToRemove.style.animation = 'fadeOut 0.5s ease';
    setTimeout(() => {
        artworkToRemove.remove();
        
        // Проверяем, остались ли еще картины у этого художника
        const artistArtworkCount = countArtistArtworks(fullName);
        if (artistArtworkCount === 0) {
            // Удаляем художника из списка
            removeArtistFromList(fullName);
        }
        
        // Показываем сообщение об успехе
        alert(`Картина "${removeArtworkTitle}" успешно удалена из галереи!`);
    }, 500);
    
    // Очищаем форму и скрываем её
    removeArtworkForm.reset();
    removeForm.style.display = 'none';
    updateButtonsState();
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем обработчики ошибок для всех существующих изображений
    const images = document.querySelectorAll('.artwork img');
    images.forEach(img => {
        setImageErrorHandler(img);
    });
    
    // Инициализируем состояние кнопок
    updateButtonsState();
});