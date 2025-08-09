// Danh sách các trường đại học USA
const usaUniversities = [
    {
        name: "Santa Fe College",
        shortName: "SFC",
        logo: "https://logos-world.net/wp-content/uploads/2023/01/Santa-Fe-College-Logo.png",
        state: "Florida"
    }
];

// Tạo tên random USA
const usaNameSyllables = {
    first: {
        male: [
            "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Christopher",
            "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua",
            "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Jason", "Edward", "Jeffrey", "Ryan",
            "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
            "Benjamin", "Samuel", "Gregory", "Alexander", "Patrick", "Frank", "Raymond", "Jack", "Dennis", "Jerry"
        ],
        female: [
            "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
            "Nancy", "Lisa", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle",
            "Laura", "Sarah", "Kimberly", "Deborah", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen",
            "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Amy", "Kathleen", "Angela",
            "Shirley", "Emma", "Olivia", "Sophia", "Ava", "Isabella", "Mia", "Abigail", "Emily", "Charlotte"
        ]
    },
    last: [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
        "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
        "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
        "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
    ]
};

function generateUSAFullName() {
    // Chọn giới tính ngẫu nhiên
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstName = getRandomElement(usaNameSyllables.first[gender]);
    const lastName = getRandomElement(usaNameSyllables.last);
    
    // Có thể có middle initial
    const hasMiddle = Math.random() > 0.6;
    if (hasMiddle) {
        const middleInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        return `${firstName} ${middleInitial}. ${lastName}`;
    }
    
    return `${firstName} ${lastName}`;
}

// Danh sách chuyên ngành USA
const usaMajors = [
    "Computer Science", "Business Administration", "Psychology", "Biology", "Engineering",
    "English Literature", "Mathematics", "Economics", "Political Science", "History",
    "Communications", "Chemistry", "Physics", "Art", "Music", "Philosophy", "Sociology",
    "Criminal Justice", "Education", "Nursing", "Finance", "Marketing", "Accounting",
    "International Relations", "Environmental Science", "Pre-Med", "Pre-Law", "Theatre Arts"
];

// Danh sách các trường/khoa USA
const usaSchools = [
    "School of Engineering", "College of Arts and Sciences", "Business School", "School of Medicine",
    "Law School", "School of Education", "School of Nursing", "Graduate School of Arts and Sciences",
    "School of Public Health", "School of Architecture", "School of Music", "College of Liberal Arts",
    "School of Communications", "College of Fine Arts", "School of Social Work", "School of Pharmacy"
];

// Lưu danh sách ảnh trả về từ API để chọn
let studentPhotoList = [];

// Hàm lấy ảnh từ thispersonnotexist.org qua proxy server
async function getStudentPhotoList() {
    try {
        console.log('📡 Requesting student photos...');
        const response = await fetch('/api/load-faces', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numFaces: 8,
                ageGroup: "young-adult",
                gender: "mixed"
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Got response:', data);
            
            if (data.fc && Array.isArray(data.fc)) {
                const photoUrls = data.fc.map(base64path => `/api/image/${base64path}`);
                console.log('🖼️ Generated photo URLs:', photoUrls);
                return photoUrls;
            } else {
                console.warn('⚠️ No faces array in response:', data);
                return [];
            }
        } else {
            console.error('❌ API Error:', response.status, response.statusText);
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Error fetching photos:', error);
        showNotification('Could not load photos. Using default avatar.', 'error');
        return [];
    }
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDate() {
    const start = new Date(1998, 0, 1);
    const end = new Date(2005, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
}

function generateUSAStudentID(universityShort) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${universityShort}${year}.${randomNum.toString().substring(0, 10)}`;
}

function generateUSACourse() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear + Math.floor(Math.random() * 3) - 1; // -1, 0, 1, 2
    const endYear = startYear + 4;
    return `${startYear} - ${endYear}`;
}

function generateValidUntil() {
    const currentDate = new Date();
    const validDate = new Date(currentDate.getFullYear() + Math.floor(Math.random() * 3) + 1, 4, 31); // May 31st
    return validDate.toLocaleDateString('en-US');
}

async function generateUSAStudentCard() {
    console.log('🎲 Generating USA student card...');
    
    // Disable generate button and show loading
    const generateBtn = document.querySelector('.btn-generate');
    const originalContent = generateBtn.innerHTML;
    generateBtn.innerHTML = '<div class="loading-spinner"></div>Loading...';
    generateBtn.disabled = true;
    
    // Disable download button
    const downloadBtn = document.querySelector('.btn-download');
    downloadBtn.disabled = true;
    
    try {
        // Lấy danh sách ảnh mới
        studentPhotoList = await getStudentPhotoList();
        
        // Chọn university ngẫu nhiên
        const university = getRandomElement(usaUniversities);
        const name = generateUSAFullName();
        const dob = generateRandomDate();
        const course = generateUSACourse();
        const major = getRandomElement(usaMajors);
        const school = getRandomElement(usaSchools);
        const studentId = generateUSAStudentID(university.shortName);
        const validUntil = generateValidUntil();
        
        // Chọn ảnh ngẫu nhiên từ danh sách
        let photoUrl = 'https://channel.mediacdn.vn/prupload/879/2018/05/img20180503174618883.jpg'; // default
        if (studentPhotoList.length > 0) {
            photoUrl = getRandomElement(studentPhotoList);
        }
        
        // Cập nhật thông tin trên card
        document.getElementById('university-name').textContent = university.name;
        document.getElementById('university-logo').src = university.logo;
        document.getElementById('student-name').textContent = name;
        document.getElementById('student-dob').textContent = dob;
        document.getElementById('student-course').textContent = course;
        document.getElementById('student-class').textContent = major;
        document.getElementById('student-department').textContent = school;
        document.getElementById('student-state').textContent = university.state;
        document.getElementById('student-photo').src = photoUrl;
        document.getElementById('student-id').textContent = `🆔 Student ID: ${studentId}`;
        document.getElementById('valid-until').textContent = validUntil;
        
        // Cập nhật barcode với tên trường
        document.getElementById('barcode').src = `/api/barcode?data=${encodeURIComponent(university.name)}&code=Code128`;
        
        console.log('✅ Card generated successfully!');
        showNotification('New student card generated!', 'success');
        
        // Enable download button
        downloadBtn.disabled = false;
        
    } catch (error) {
        console.error('❌ Error generating card:', error);
        showNotification('Error generating card. Please try again.', 'error');
    } finally {
        // Restore generate button
        generateBtn.innerHTML = originalContent;
        generateBtn.disabled = false;
    }
}

async function downloadCard() {
    console.log('💾 Starting download...');
    const downloadBtn = document.querySelector('.btn-download');
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<div class="loading-spinner"></div>Preparing...';
    downloadBtn.disabled = true;
    
    try {
        const card = document.getElementById('student-card');
        const canvas = await html2canvas(card, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false
        });
        
        const link = document.createElement('a');
        link.download = `usa-student-card-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        console.log('✅ Download completed!');
        showNotification('Card downloaded successfully!', 'success');
    } catch (error) {
        console.error('❌ Download error:', error);
        showNotification('Download failed. Please try again.', 'error');
    } finally {
        downloadBtn.innerHTML = originalContent;
        downloadBtn.disabled = false;
    }
}

// Notification System
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Generate initial card khi trang được load
window.onload = async function() {
    console.log('🎓 USA Student Card Generator loaded');
    await generateUSAStudentCard();
};
