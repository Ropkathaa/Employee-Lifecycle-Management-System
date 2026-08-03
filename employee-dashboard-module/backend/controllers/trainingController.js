const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Training = require("../models/Training");
const TrainingCity = require("../models/TrainingCity");
const { TRAINING_STATUS } = require("../constants");
const { getCurrentEmployeeId } = require("../utils/currentEmployee");

// ======================
// Default cities (seeded on first request so HR can manage locations)
// ======================
const DEFAULT_CITIES = [
  "Kolkata",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Mumbai",
  "Delhi",
  "Ahmedabad",
];

// ======================
// Helper: get available cities (auto-seed defaults)
// ======================
const getCities = async () => {
  const count = await TrainingCity.countDocuments();
  if (count === 0) {
    await TrainingCity.insertMany(DEFAULT_CITIES.map((name) => ({ name })));
  }
  return TrainingCity.find({ active: true }).sort({ name: 1 });
};

// ======================
// Helper: seed sample assigned trainings (first run only)
// ======================
const seedDefaultTrainings = async () => {
  const count = await Training.countDocuments();
  if (count > 0) return;

  const now = new Date();
  const day = 86400000;
  const seed = [
    {
      courseName: "Advanced React Development",
      description:
        "A deep dive into React 18, hooks, performance optimization and modern application patterns.",
      category: "Technical",
      trainerName: "David Miller",
      durationDays: 14,
      assignedDate: now,
      startDate: new Date(now.getTime() - 7 * day),
      dueDate: new Date(now.getTime() + 7 * day),
      trainingMode: "online",
      progress: 50,
      status: TRAINING_STATUS.IN_PROGRESS,
      learningObjectives: [
        "Master React hooks and custom hooks",
        "Optimize rendering performance",
        "Build production-grade applications",
      ],
      modules: [
        { title: "React Fundamentals", description: "Components, props and state management." },
        { title: "Hooks in Depth", description: "useState, useEffect, useMemo and custom hooks." },
        { title: "Performance", description: "Memoization, code splitting and lazy loading." },
      ],
      employee: "You",
      employeeId: "0",
    },
    {
      courseName: "Leadership & Management Essentials",
      description: "Core leadership skills every manager needs to lead high-performing teams.",
      category: "Management",
      trainerName: "Sarah Johnson",
      durationDays: 10,
      assignedDate: now,
      startDate: new Date(now.getTime() - 20 * day),
      dueDate: new Date(now.getTime() - 10 * day),
      trainingMode: "offline",
      trainingCity: "Kolkata",
      progress: 100,
      status: TRAINING_STATUS.COMPLETED,
      certificateAvailable: true,
      learningObjectives: [
        "Lead and motivate teams effectively",
        "Resolve conflicts constructively",
      ],
      modules: [
        { title: "Team Leadership", description: "Motivation, delegation and feedback." },
        { title: "Conflict Resolution", description: "Handling disagreements professionally." },
      ],
      employee: "You",
      employeeId: "0",
    },
    {
      courseName: "Cloud Computing Fundamentals",
      description: "Introduction to AWS, Azure and GCP for cloud beginners.",
      category: "Technical",
      trainerName: "Alex Chen",
      durationDays: 15,
      assignedDate: now,
      startDate: new Date(now.getTime() + 3 * day),
      dueDate: new Date(now.getTime() + 18 * day),
      trainingMode: "online",
      progress: 0,
      status: TRAINING_STATUS.PENDING,
      learningObjectives: [
        "Understand core cloud concepts",
        "Deploy basic cloud services",
      ],
      modules: [
        { title: "Cloud Basics", description: "IaaS, PaaS and SaaS explained." },
        { title: "Getting Started", description: "Setting up your first cloud account." },
      ],
      employee: "You",
      employeeId: "0",
    },
    {
      courseName: "Cybersecurity Essentials",
      description: "Security best practices every employee should follow to protect company data.",
      category: "Compliance",
      trainerName: "Michael Brown",
      durationDays: 12,
      assignedDate: now,
      startDate: new Date(now.getTime() - 3 * day),
      dueDate: new Date(now.getTime() + 9 * day),
      trainingMode: "online",
      progress: 25,
      status: TRAINING_STATUS.IN_PROGRESS,
      learningObjectives: [
        "Identify common security threats",
        "Secure accounts and data",
      ],
      modules: [
        { title: "Threat Landscape", description: "Phishing, malware and social engineering." },
        { title: "Password Security", description: "Strong passwords and multi-factor authentication." },
      ],
      employee: "You",
      employeeId: "0",
    },
    {
      courseName: "Agile & Scrum Masterclass",
      description: "Master agile methodologies, scrum ceremonies and backlog management.",
      category: "Management",
      trainerName: "Lisa Wilson",
      durationDays: 5,
      assignedDate: now,
      startDate: null,
      dueDate: new Date(now.getTime() + 30 * day),
      trainingMode: "offline",
      trainingCity: "Mumbai",
      progress: 0,
      status: TRAINING_STATUS.PENDING,
      learningObjectives: [
        "Run effective sprint ceremonies",
        "Manage the product backlog",
      ],
      modules: [
        { title: "Scrum Roles", description: "Product Owner, Scrum Master and Development Team." },
        { title: "Sprint Planning", description: "Estimating and committing to sprint goals." },
      ],
      employee: "You",
      employeeId: "0",
    },
  ];

  await Training.insertMany(seed);
};

// ======================
// GET /api/employee/trainings/cities
// @desc    Get available training cities (managed by HR)
// ======================
const getTrainingCities = asyncHandler(async (req, res) => {
  const cities = await getCities();
  ApiResponse.success(res, cities, "Training cities fetched successfully");
});

// ======================
// GET /api/employee/trainings
// @desc    Get all trainings assigned to the employee
// ======================
const getTrainings = asyncHandler(async (req, res) => {
  await seedDefaultTrainings();

  const {
    search,
    status,
    category,
    sortBy = "dueDate",
    order = "asc",
    page = 1,
    limit = 10,
  } = req.query;

  const trainings = await Training.find().sort({ assignedDate: -1 });

  let data = trainings.map((t) => {
    const obj = t.toObject();
    obj.effectiveStatus = t.effectiveStatus;
    return obj;
  });

  // Search by course name
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((t) => (t.courseName || "").toLowerCase().includes(q));
  }

  // Filter by effective status
  if (status && status !== "all") {
    data = data.filter((t) => t.effectiveStatus === status);
  }

  // Filter by category
  if (category && category !== "all") {
    data = data.filter((t) => t.category === category);
  }

  // Sort
  data.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (aVal === null || aVal === undefined || aVal === "") aVal = 0;
    if (bVal === null || bVal === undefined || bVal === "") bVal = 0;
    let cmp = 0;
    if (aVal instanceof Date || typeof aVal === "string" || typeof aVal === "number") {
      cmp = new Date(aVal).getTime() - new Date(bVal).getTime();
      if (Number.isNaN(cmp)) cmp = String(aVal).localeCompare(String(bVal));
    } else {
      cmp = String(aVal).localeCompare(String(bVal));
    }
    return order === "asc" ? cmp : -cmp;
  });

  // Paginate
  const total = data.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = data.slice(start, start + parseInt(limit));

  ApiResponse.paginated(
    res,
    paginated,
    total,
    parseInt(page),
    parseInt(limit),
    "Trainings fetched successfully"
  );
});

// ======================
// GET /api/employee/trainings/:id
// @desc    Get a single training by id
// ======================
const getTrainingById = asyncHandler(async (req, res) => {
  const training = await Training.findById(req.params.id);
  if (!training) {
    return ApiResponse.error(res, "Training not found", 404);
  }
  const data = training.toObject();
  data.effectiveStatus = training.effectiveStatus;
  ApiResponse.success(res, data, "Training fetched successfully");
});

// ======================
// POST /api/employee/trainings/:id/register
// @desc    Register for an assigned training
// ======================
const registerTraining = asyncHandler(async (req, res) => {
  const { mode, city } = req.body;

  if (!mode || !["online", "offline"].includes(mode)) {
    return ApiResponse.error(res, "Please select the training mode.", 400);
  }

  if (mode === "offline" && !city) {
    return ApiResponse.error(res, "Please select a training city.", 400);
  }

  const training = await Training.findById(req.params.id);
  if (!training) {
    return ApiResponse.error(res, "Training not found", 404);
  }

  if (training.status !== TRAINING_STATUS.PENDING) {
    return ApiResponse.error(res, "This training has already been registered.", 400);
  }

  training.status = TRAINING_STATUS.REGISTERED;
  training.trainingMode = mode;
  training.trainingCity = mode === "offline" ? city : "";
  training.registration.mode = mode;
  training.registration.city = mode === "offline" ? city : "";
  training.registration.registeredAt = new Date();

  const updated = await training.save();
  const data = updated.toObject();
  data.effectiveStatus = updated.effectiveStatus;
  ApiResponse.success(res, data, "Training registered successfully");
});

// ======================
// PUT /api/employee/trainings/:id/progress
// @desc    Start training / update progress percentage
// ======================
const updateTrainingProgress = asyncHandler(async (req, res) => {
  const { progress } = req.body;

  if (progress === undefined) {
    return ApiResponse.error(res, "Progress is required", 400);
  }

  const value = parseInt(progress);
  if (Number.isNaN(value) || value < 0 || value > 100) {
    return ApiResponse.error(res, "Progress must be between 0 and 100", 400);
  }

  const training = await Training.findById(req.params.id);
  if (!training) {
    return ApiResponse.error(res, "Training not found", 404);
  }

  if (training.status === TRAINING_STATUS.COMPLETED) {
    return ApiResponse.error(res, "This training is already completed.", 400);
  }

  if (training.status === TRAINING_STATUS.PENDING) {
    return ApiResponse.error(res, "Please register for this training before starting.", 400);
  }

  training.progress = value;

  if (value >= 100) {
    training.progress = 100;
    training.status = TRAINING_STATUS.COMPLETED;
    training.certificateAvailable = true;
  } else if (value > 0 || training.status === TRAINING_STATUS.REGISTERED) {
    training.status = TRAINING_STATUS.IN_PROGRESS;
  }

  const updated = await training.save();
  const data = updated.toObject();
  data.effectiveStatus = updated.effectiveStatus;
  ApiResponse.success(res, data, "Training progress updated successfully");
});

// ======================
// GET /api/employee/trainings/:id/certificate
// @desc    Get certificate (only available after completion)
// ======================
const getTrainingCertificate = asyncHandler(async (req, res) => {
  const training = await Training.findById(req.params.id);
  if (!training) {
    return ApiResponse.error(res, "Training not found", 404);
  }

  if (training.effectiveStatus !== TRAINING_STATUS.COMPLETED || !training.certificateAvailable) {
    return ApiResponse.error(
      res,
      "Certificate will be available after successful completion.",
      400
    );
  }

  const certificate = {
    _id: training._id,
    courseName: training.courseName,
    trainerName: training.trainerName,
    category: training.category,
    durationDays: training.durationDays,
    completionDate: training.updatedAt,
    certificateId: `CERT-${training._id.toString().slice(-8).toUpperCase()}`,
  };

  ApiResponse.success(res, certificate, "Certificate retrieved successfully");
});

module.exports = {
  getTrainingCities,
  getTrainings,
  getTrainingById,
  registerTraining,
  updateTrainingProgress,
  getTrainingCertificate,
};

