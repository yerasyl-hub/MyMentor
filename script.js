document.addEventListener('DOMContentLoaded', function () {
    const mentors = [
        {
            id: 1,
            name: "Emma Wilson",
            specialization: "Frontend Expert",
            bio: "Senior Frontend Developer (React/Vue) with 7+ years experience at Google and Shopify",
            image: "img/mentor1.jpg",
            tasks: [
                {
                    text: "Build responsive layout with CSS Grid",
                    completed: false,
                    links: [
                        { title: "CSS Grid Guide", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
                        { title: "Grid Examples", url: "https://gridbyexample.com/examples/" }
                    ]
                },
                {
                    text: "Create React app with TypeScript",
                    completed: false,
                    links: [
                        { title: "React+TS Docs", url: "https://create-react-app.dev/docs/adding-typescript/" },
                        { title: "TS Handbook", url: "https://www.typescriptlang.org/docs/handbook/react.html" }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "James Rodriguez",
            specialization: "Backend Specialist",
            bio: "Node.js and Python expert with focus on high-performance APIs",
            image: "img/mentor2.jpg",
            tasks: [
                {
                    text: "Create REST API with authentication",
                    completed: false,
                    links: [
                        { title: "Node.js REST Guide", url: "https://blog.logrocket.com/build-rest-api-node-express-mysql/" },
                        { title: "JWT Auth Tutorial", url: "https://www.bezkoder.com/node-js-jwt-authentication-mysql/" }
                    ]
                },
                {
                    text: "Learn database optimization",
                    completed: false,
                    links: [
                        { title: "SQL Performance", url: "https://use-the-index-luke.com/" },
                        { title: "MongoDB Indexing", url: "https://www.mongodb.com/docs/manual/indexes/" }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "Priya Patel",
            specialization: "Data Scientist",
            bio: "Machine learning engineer specializing in NLP and predictive models",
            image: "img/mentor3.jpg",
            tasks: [
                {
                    text: "Complete Python data analysis course",
                    completed: false,
                    links: [
                        { title: "Kaggle Python", url: "https://www.kaggle.com/learn/python" },
                        { title: "Pandas Tutorial", url: "https://pandas.pydata.org/docs/getting_started/tutorials.html" }
                    ]
                },
                {
                    text: "Build your first ML model",
                    completed: false,
                    links: [
                        { title: "Scikit-learn", url: "https://scikit-learn.org/stable/tutorial/basic/tutorial.html" },
                        { title: "TensorFlow Guide", url: "https://www.tensorflow.org/tutorials" }
                    ]
                }
            ]
        },
    ];
    const mentorsContainer = document.getElementById('mentors-container');
    const goalInput = document.getElementById('goal-input');
    const setGoalBtn = document.getElementById('set-goal');
    const currentGoalDisplay = document.getElementById('current-goal-display');
    const tasksContainer = document.getElementById('tasks-container');
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const resourceTitle = document.getElementById('resource-title');
    const resourceUrl = document.getElementById('resource-url');
    const addResourceBtn = document.getElementById('add-resource');
    const resourcesContainer = document.getElementById('resources-container');
    const navLinks = document.querySelectorAll('nav a');
    let state = {
        selectedMentor: null,
        goal: '',
        tasks: [],
        resources: []
    };
    function init() {
        loadState();
        setupEventListeners();
        renderAll();
    }
    function loadState() {
        const savedState = localStorage.getItem('myMentorState');
        if (savedState) {
            state = JSON.parse(savedState);
        }
    }
    function saveState() {
        localStorage.setItem('myMentorState', JSON.stringify(state));
    }
    function setupEventListeners() {
        setGoalBtn.addEventListener('click', setGoal);
        goalInput.addEventListener('keypress', (e) => e.key === 'Enter' && setGoal());

        addTaskBtn.addEventListener('click', addTask);
        newTaskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

        addResourceBtn.addEventListener('click', addResource);
        resourceUrl.addEventListener('keypress', (e) => e.key === 'Enter' && addResource());

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    function renderAll() {
        renderMentors();
        renderGoal();
        renderTasks();
        renderResources();
    }
    function renderMentors() {
        mentorsContainer.innerHTML = '';
        mentors.forEach(mentor => {
            const mentorCard = document.createElement('div');
            mentorCard.className = `mentor-card ${state.selectedMentor?.id === mentor.id ? 'selected' : ''}`;
            mentorCard.innerHTML = `
                <img src="${mentor.image}" alt="${mentor.name}" class="mentor-img">
                <div class="mentor-info">
                    <h3>${mentor.name}</h3>
                    <span class="mentor-specialization">${mentor.specialization}</span>
                    <p>${mentor.bio}</p>
                </div>
            `;
            mentorCard.addEventListener('click', () => selectMentor(mentor));
            mentorsContainer.appendChild(mentorCard);
        });
    }
    function selectMentor(mentor) {
        state.selectedMentor = mentor;
        if (mentor.tasks && state.tasks.length === 0) {
            state.tasks = [...mentor.tasks];
        }
        saveState();
        renderAll();
    }
    function renderGoal() {
        if (state.goal) {
            currentGoalDisplay.innerHTML = `
                <h3><i class="fas fa-trophy"></i> Current Goal:</h3>
                <p>${state.goal}</p>
                <button id="edit-goal" class="edit-btn"><i class="fas fa-edit"></i> Edit Goal</button>
            `;
            document.getElementById('edit-goal').addEventListener('click', () => {
                goalInput.value = state.goal;
                state.goal = '';
                saveState();
                renderGoal();
            });
        } else {
            currentGoalDisplay.innerHTML = '<p><i class="fas fa-info-circle"></i> No goal set yet</p>';
        }
    }
    function setGoal() {
        const goal = goalInput.value.trim();
        if (goal) {
            state.goal = goal;
            goalInput.value = '';
            saveState();
            renderGoal();
        }
    }
    function renderTasks() {
        tasksContainer.innerHTML = '';

        if (state.tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="task-item">
                    <p><i class="fas fa-info-circle"></i> No tasks yet. Select a mentor or add custom tasks.</p>
                </div>
            `;
            return;
        }

        state.tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';

            let linksHTML = '';
            if (task.links && task.links.length > 0) {
                linksHTML = `<div class="task-links">`;
                task.links.forEach(link => {
                    linksHTML += `<a href="${link.url}" target="_blank" class="task-link">${link.title}</a>`;
                });
                linksHTML += `</div>`;
            }

            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
                <div class="task-content">
                    <div class="task-text ${task.completed ? 'task-completed' : ''}">${task.text}</div>
                    ${linksHTML}
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-task" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="task-btn delete-task" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            tasksContainer.appendChild(taskItem);
        });
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskComplete);
        });

        document.querySelectorAll('.edit-task').forEach(btn => {
            btn.addEventListener('click', editTask);
        });

        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    function toggleTaskComplete(e) {
        const index = e.target.dataset.index;
        state.tasks[index].completed = e.target.checked;
        saveState();
        renderTasks();
    }
    function editTask(e) {
        const index = e.target.closest('button').dataset.index;
        const newText = prompt('Edit task:', state.tasks[index].text);
        if (newText && newText.trim()) {
            state.tasks[index].text = newText.trim();
            saveState();
            renderTasks();
        }
    }
    function deleteTask(e) {
        const index = e.target.closest('button').dataset.index;
        if (confirm('Delete this task?')) {
            state.tasks.splice(index, 1);
            saveState();
            renderTasks();
        }
    }

    function addTask() {
        const text = newTaskInput.value.trim();
        if (text) {
            state.tasks.push({
                text,
                completed: false,
                links: []
            });
            newTaskInput.value = '';
            saveState();
            renderTasks();
        }
    }
    function renderResources() {
        resourcesContainer.innerHTML = '';

        if (state.resources.length === 0) {
            resourcesContainer.innerHTML = `
                <div class="resource-card">
                    <div class="resource-content">
                        <p><i class="fas fa-info-circle"></i> No resources saved yet</p>
                    </div>
                </div>
            `;
            return;
        }

        state.resources.forEach((resource, index) => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            resourceCard.innerHTML = `
                <div class="resource-content">
                    <div class="resource-title">${resource.title}</div>
                    <a href="${resource.url}" target="_blank" class="resource-url">${resource.url}</a>
                    <div class="resource-actions">
                        <button class="task-btn delete-resource" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            resourcesContainer.appendChild(resourceCard);
        });

        document.querySelectorAll('.delete-resource').forEach(btn => {
            btn.addEventListener('click', deleteResource);
        });
    }
    function addResource() {
        const title = resourceTitle.value.trim();
        const url = resourceUrl.value.trim();

        if (title && url) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                alert('Please enter a valid URL (starting with http:// or https://)');
                return;
            }

            state.resources.push({ title, url });
            resourceTitle.value = '';
            resourceUrl.value = '';
            saveState();
            renderResources();
        }
    }
    function deleteResource(e) {
        const index = e.target.closest('button').dataset.index;
        if (confirm('Delete this resource?')) {
            state.resources.splice(index, 1);
            saveState();
            renderResources();
        }
    }
    init();
});