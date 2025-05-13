import React from 'react';
import { ChevronRight } from 'lucide-react';
import useSWR from 'swr';

interface WooCommerceCourse {
  id: number;
  name: string;
  price_html: string;
  images: Array<{
    src: string;
  }>;
  categories: Array<{
    name: string;
  }>;
  permalink: string;
}

interface CourseCardProps {
  image: string;
  title: string;
  category: string;
  price: string;
  link: string;
}

const WOO_API_KEY = '8474hjheuydss8214267dd6761d9e89efad58742jhus8';
const WOO_API_SECRET = '3878743843970874jhkjlhdsf87978643jkj';

const fetcher = async (url: string) => {
  const credentials = btoa(`${WOO_API_KEY}:${WOO_API_SECRET}`);
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
};

const CourseCard: React.FC<CourseCardProps> = ({ image, title, category, price, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-t-2 border-teal-500 border-solid rounded-full animate-spin"></div>
        </div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
          onLoad={(e) => {
            e.currentTarget.classList.remove('opacity-0');
            e.currentTarget.classList.add('opacity-100');
          }}
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-full mb-3">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="flex justify-between items-center mt-4">
          <span 
            className="text-teal-600 font-semibold"
            dangerouslySetInnerHTML={{ __html: price }}
          />
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex items-center text-teal-600 hover:text-teal-700 transition duration-300"
          >
            <span>Learn more</span>
            <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

const LatestCourses = () => {
  const { data: courses, error, isLoading } = useSWR<WooCommerceCourse[]>(
    'https://study.tandabuionline.ac.tz/wp-json/wc/v3/products?status=publish&orderby=date&per_page=3',
    fetcher
  );
  
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            Failed to load courses. Please try again later.
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Latest Courses
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(null).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : Array.isArray(courses) && courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard 
                key={course.id}
                image={course.images[0]?.src || 'https://via.placeholder.com/800x600'}
                title={course.name}
                category={course.categories[0]?.name || 'Course'}
                price={course.price_html}
                link={course.permalink}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No courses available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestCourses;
