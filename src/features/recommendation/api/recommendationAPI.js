import axios from 'axios';

const USE_MOCK_DATA = true;

const mockPlaces = [
  {
    id: 1,
    name: 'Seoul Forest',
    address: 'Seoul Seongdong-gu',
    category: 'Park',
    rating: 4.3,
    description: 'Beautiful urban forest park',
    image: null,
    tags: ['nature', 'walking', 'healing']
  },
  {
    id: 2,
    name: 'Bukchon Hanok Village',
    address: 'Seoul Jongno-gu',
    category: 'Cultural Heritage',
    rating: 4.1,
    description: 'Traditional Korean village',
    image: null,
    tags: ['traditional', 'culture', 'photo']
  }
];

const mockPrograms = [
  {
    id: 1,
    title: 'Yoga Class',
    category: 'Exercise/Health',
    duration: '60min',
    price: 15000,
    description: 'Beginner-friendly yoga class',
    image: null,
    tags: ['yoga', 'healing', 'health']
  },
  {
    id: 2,
    title: 'Pottery Experience',
    category: 'Arts/Culture',
    duration: '120min',
    price: 25000,
    description: 'Create your own pottery',
    image: null,
    tags: ['pottery', 'making', 'experience']
  }
];

export const getRecommendationPlaces = async () => {
  try {
    if (USE_MOCK_DATA) {
      console.log('Mock: Loading places data...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPlaces;
    }

    const token = localStorage.getItem('authToken');
    const response = await axios.get('/api/v1/recommendations/places', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to load places:', error);
    throw error.response?.data || error.message;
  }
};

export const getRecommendationPrograms = async () => {
  try {
    if (USE_MOCK_DATA) {
      console.log('Mock: Loading programs data...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPrograms;
    }

    const token = localStorage.getItem('authToken');
    const response = await axios.get('/api/v1/recommendations/programs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to load programs:', error);
    throw error.response?.data || error.message;
  }
};