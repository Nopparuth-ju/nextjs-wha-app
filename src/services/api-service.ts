export const getCourses = async () => {
    const response = await fetch('https://api.codingthailand.com/api/course', {
        next: { revalidate: 60 } // Optional: add revalidation
    });
    return response.json();
};

export const getApiVersion = async () => {
    const response = await fetch('https://api.codingthailand.com/api/version');
    return response.json();
};
