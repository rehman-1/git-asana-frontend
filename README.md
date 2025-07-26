# Git-Asana Developer Analytics Dashboard

A modern, responsive dashboard that integrates Git and Asana data to provide comprehensive developer productivity analytics and task tracking insights.

## 🚀 Features

### 📊 Overview Dashboard

- **Key Metrics Cards**: Total commits, completed tasks, active developers, lines of code, and more
- **Interactive Charts**: Visual representation of commits by developer and task status distribution
- **Developer Performance**: Comprehensive analytics showing task completion vs code contributions

### 🔍 Git Analysis

- **Commit Statistics**: Detailed breakdown of commits by developer
- **Code Metrics**: Lines added/deleted, files changed, repository contributions
- **Developer Activity**: Timeline and frequency of contributions
- **Repository Insights**: Multi-repo contribution tracking

### 📋 Asana Task Tracking

- **Task Status Overview**: Visual distribution of task completion states
- **Developer Assignment**: Track which tasks are assigned to which developers
- **Progress Monitoring**: In-progress vs completed task analysis
- **Task Details**: Direct links to Asana tasks with comprehensive metadata

### ⏱️ Developer Efforts

- **Time Tracking**: Detailed time spent analysis per task
- **Effort vs Output**: Compare estimated vs actual time spent
- **Productivity Metrics**: Analyze developer efficiency and workload
- **Commit Correlation**: Link time spent with actual code contributions

### 🔄 Task vs Commit Analysis

- **Alignment Tracking**: Compare Asana tasks with actual Git commits
- **Completion Status**: Identify tasks completed with/without code changes
- **Development Activity**: Track active development vs task status
- **Quality Insights**: Ensure task completion aligns with code delivery

## 🛠️ Technology Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts for interactive data visualization
- **Tables**: React Data Table Component with sorting and pagination
- **Date Handling**: React DatePicker for date range selection
- **Icons**: Lucide React for consistent iconography
- **HTTP Client**: Axios for API communication

## 📡 API Integration

The dashboard integrates with the following API endpoints:

### Git Endpoints

- `POST /api/git/report?start_date={date}&end_date={date}` - Get Git commit data
- `POST /api/git/reload` - Reload Git repository data

### Asana Endpoints

- `GET /api/asana/summary` - Get Asana task summary with developer breakdown
- `POST /api/asana/reload` - Reload Asana task data
- `POST /api/asana/efforts?start_date={date}&end_date={date}` - Get developer effort tracking
- `POST /api/asana/developer_summary?start_date={date}&end_date={date}` - Get developer-specific task summary

### Analytics Endpoints

- `GET /api/analytics?start_date={date}&end_date={date}` - Get comprehensive analytics data
- `POST /reload_all` - Reload all data sources (Git + Asana)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API server running on `http://localhost:8000`

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd git-asana-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the dashboard

### Build for Production

```bash
npm run build
# or
yarn build
```

## 📱 Dashboard Sections

### 1. Overview Tab

- **Dashboard Cards**: Key performance indicators at a glance
- **Commit Activity Chart**: Bar chart showing commits by developer
- **Task Status Distribution**: Pie chart of task completion states
- **Developer Performance**: Multi-metric comparison across developers

### 2. Git Analysis Tab

- **Commit Visualization**: Interactive charts of Git activity
- **Developer Table**: Detailed commit statistics per developer
- **Repository Breakdown**: Multi-repo contribution analysis
- **Code Quality Metrics**: Lines changed, files modified, commit frequency

### 3. Asana Tasks Tab

- **Task Overview**: Comprehensive task listing with status indicators
- **Assignment Tracking**: See which developer is working on what
- **Progress Monitoring**: Track task completion rates
- **Direct Integration**: Click-through links to Asana tasks

### 4. Developer Efforts Tab

- **Time Tracking**: Detailed time spent per task and developer
- **Effort Analysis**: Compare estimated vs actual time
- **Productivity Insights**: Identify bottlenecks and high performers
- **Commit Correlation**: See how time spent relates to code output

### 5. Task vs Commits Tab

- **Alignment Analysis**: Compare task completion with actual code changes
- **Status Categories**:
  - ✅ **Completed & Coded**: Tasks done with corresponding commits
  - ⚠️ **Done (No Code)**: Completed tasks without code changes
  - 🔄 **Active Development**: In-progress tasks with active commits
  - ❌ **No Activity**: Tasks without any development activity

## 🎨 UI/UX Features

### Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layouts**: Grid systems that adjust to viewport
- **Touch-Friendly**: Mobile-optimized interactions

### Interactive Elements

- **Date Range Picker**: Filter data by custom date ranges
- **Developer Filter**: Focus on specific developer metrics
- **Sortable Tables**: Click column headers to sort data
- **Hover Effects**: Rich tooltips and interactive feedback

### Visual Indicators

- **Status Badges**: Color-coded task and completion states
- **Progress Bars**: Visual representation of completion rates
- **Icon System**: Consistent iconography throughout
- **Color Coding**: Intuitive color schemes for different data types

## 🔧 Configuration

### API Base URL

Update the API base URL in `src/api/apiClient.js`:

```javascript
const API_BASE = "http://localhost:8000"; // Change to your API server
```

### Date Range Defaults

Modify default date ranges in `src/pages/Dashboard.jsx`:

```javascript
const [dateRange, setDateRange] = useState({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  endDate: new Date(),
});
```

## 📊 Data Structure

The dashboard expects specific data structures from the API:

### Git Report Response

```json
{
  "commits": [
    {
      "repo": "Frontend",
      "developer": "John Doe",
      "timestamp": 1752053433,
      "message": "fix: resolve authentication issue",
      "added": 150,
      "deleted": 25,
      "files": 3,
      "link": "http://git.example.com/commit/abc123"
    }
  ],
  "count": 115
}
```

### Asana Summary Response

```json
{
  "total_in_progress": 9,
  "total_done": 171,
  "developers": {
    "John Doe": {
      "in_progress": [...],
      "done": [...]
    }
  }
}
```

## 🚨 Error Handling

The dashboard includes comprehensive error handling:

- **API Failures**: Graceful degradation when APIs are unavailable
- **Data Validation**: Handles missing or malformed data
- **User Feedback**: Clear error messages and loading states
- **Retry Logic**: Automatic retry for failed requests

## 🔄 Real-time Updates

- **Manual Refresh**: "Reload Data" button to fetch latest information
- **Auto-refresh**: Configurable automatic data updates
- **Loading States**: Visual feedback during data fetching
- **Error Recovery**: Automatic retry on network failures

## 📈 Performance Optimizations

- **Memoization**: React.useMemo for expensive calculations
- **Lazy Loading**: Components loaded on demand
- **Data Caching**: Intelligent caching of API responses
- **Optimized Rendering**: Efficient re-rendering strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation for backend integration
- Review the component documentation for customization options

---

**Built with ❤️ for developer productivity and project transparency**
