import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return '—';
  }
};

export const formatDateShort = (date) => {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd');
  } catch {
    return '—';
  }
};

export const timeAgo = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
};

export const formatSalary = (amount) => {
  if (!amount) return 'Not specified';
  const num = Number(amount);
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
  return `$${num.toFixed(0)}`;
};

export const formatSalaryFull = (min, max) => {
  if (!min && !max) return 'Not specified';
  if (!max) return formatSalary(min) + '+';
  return `${formatSalary(min)} – ${formatSalary(max)}`;
};

export const getStatusColor = (status) => {
  const map = {
    applied:      'applied',
    interviewing: 'interviewing',
    offer:        'offer',
    rejected:     'rejected',
    saved:        'saved',
  };
  return map[status?.toLowerCase()] || 'applied';
};

export const getStatusLabel = (status) => {
  const map = {
    applied:      'Applied',
    interviewing: 'Interviewing',
    offer:        'Offer 🎉',
    rejected:     'Rejected',
    saved:        'Saved',
  };
  return map[status?.toLowerCase()] || status;
};

export const getDomain = (company) => {
  const domains = {
    'google': 'google.com', 'amazon': 'amazon.com', 'meta': 'meta.com',
    'microsoft': 'microsoft.com', 'apple': 'apple.com', 'netflix': 'netflix.com',
    'uber': 'uber.com', 'airbnb': 'airbnb.com', 'stripe': 'stripe.com',
    'spotify': 'spotify.com', 'twitter': 'twitter.com', 'linkedin': 'linkedin.com',
    'salesforce': 'salesforce.com', 'shopify': 'shopify.com', 'slack': 'slack.com',
    'zoom': 'zoom.us', 'atlassian': 'atlassian.com', 'github': 'github.com',
    'figma': 'figma.com', 'notion': 'notion.so',
  };
  const key = company?.toLowerCase().split(' ')[0];
  return domains[key] || `${key}.com`;
};

export const getLogoUrl = (company) => {
  const domain = getDomain(company);
  return `https://logo.clearbit.com/${domain}`;
};

export const isUpcoming = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return isAfter(d, now) && isBefore(d, addDays(now, 7));
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const groupByStatus = (applications) => {
  return applications.reduce((acc, app) => {
    const status = app.status || 'applied';
    if (!acc[status]) acc[status] = [];
    acc[status].push(app);
    return acc;
  }, {});
};

export const sortApplications = (apps, sortBy) => {
  const sorted = [...apps];
  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    case 'salary-desc':
      return sorted.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
    case 'salary-asc':
      return sorted.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    case 'company':
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    default:
      return sorted;
  }
};

export const filterApplications = (apps, filters) => {
  return apps.filter(app => {
    if (filters.status && filters.status !== 'all' && app.status !== filters.status) return false;
    if (filters.platform && filters.platform !== 'all' && app.platform !== filters.platform) return false;
    if (filters.location && filters.location !== 'all' && app.locationType !== filters.location) return false;
    if (filters.bookmarked && !app.bookmarked) return false;
    return true;
  });
};

export const searchApplications = (apps, query) => {
  if (!query) return apps;
  const q = query.toLowerCase();
  return apps.filter(app =>
    app.company?.toLowerCase().includes(q) ||
    app.role?.toLowerCase().includes(q) ||
    app.location?.toLowerCase().includes(q) ||
    app.notes?.toLowerCase().includes(q)
  );
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

export const getMonthlyData = (applications) => {
  const months = {};
  applications.forEach(app => {
    if (!app.appliedDate) return;
    const key = format(new Date(app.appliedDate), 'MMM yyyy');
    months[key] = (months[key] || 0) + 1;
  });
  return Object.entries(months).map(([name, count]) => ({ name, count })).slice(-6);
};
