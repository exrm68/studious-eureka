import { Movie } from './types';

// Your Actual Bot Username
export const BOT_USERNAME = 'Cinaflix_Streembot';

// ✅ Demo data সরিয়ে দেওয়া হয়েছে - Firestore থেকে real data আসবে
// যদি Firestore empty থাকে তাহলে empty state দেখাবে
export const INITIAL_MOVIES: Movie[] = [];

// Categories for filtering
export const CATEGORIES = ['All', 'Exclusive', 'Movies', 'Web Series', 'K-Drama', 'Anime'];

// Categories for Single Movies in Admin Panel
export const MOVIE_CATEGORIES = ['Exclusive', 'Movies', 'Anime'];

// Categories for Series in Admin Panel
export const SERIES_CATEGORIES = ['Exclusive', 'Web Series', 'K-Drama', 'Anime'];