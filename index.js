const fetch = require("node-fetch");

async function add_comments(post) {
    const comments = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);

    if (comments.status !== 200) return { ...post, comments: [] };

    const comments_data = await comments.json();

    post.comments = comments_data.map(comment => ({ id: comment.id, email: comment.email, name: comment.name, body: comment.body }));

    return post;
}

function format_post(post) {
    return {
        id: post.id,
        title: post.title,
        title_crop: post.title.length > 20 ? post.title.slice(0, 20) + "..." : post.title,
        body: post.body,
        comments: []
    };
}

(async function () {
    const users = await fetch("https://jsonplaceholder.typicode.com/users");

    if (users.status !== 200) throw new Error("Error fetching users");

    const posts = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (posts.status !== 200) throw new Error("Error fetching posts");

    const users_data = await users.json();
    const posts_data = await posts.json();
    const user_posts = await Promise.all(users_data.map(async user => {
        user.website = user.website.startsWith("https://") ? user.website : `https://${user.website}`;
        user.company = user.company.name;
        user.address = `${user.address.street}, ${user.address.suite}, ${user.address.city}`;
        
        if (user.name.includes("Ervin Howell")) {
            user.posts = await Promise.all(posts_data.filter(post => post.userId === user.id).map(format_post).map(add_comments));
        } else {
            user.posts = posts_data.filter(post => post.userId === user.id).map(format_post);
        }
        return user;
    }));

    console.dir(user_posts, {depth: null})
})()

// const axios = require('axios');

// const getUsers = async () => {
//     const users = await axios.get('https://jsonplaceholder.typicode.com/users');
//     return users.data;
// };

// const getPosts = async () => {
//     const posts = await axios.get('https://jsonplaceholder.typicode.com/posts');
//     return posts.data;
// };

// const getComments = async (postId) => {
//     const comments = await axios.get(`http://jsonplaceholder.typicode.com/posts/${postId}/comments`);
//     return comments.data;
// }

// const clearUserData = async () => {
//     const users = await getUsers();
//     const data = users.map(user => {
//         const { city, street, suite } = user.address;
//         const { name } = user.company; 
//         const address = `${city}, ${street}, ${suite}`; 
//         const website = `https://${user.website}`
//         user = {...user, address, website, company: name};
//         delete user.phone;
//         delete user.username;
//         return user;
//     });
//     return data;
// };

// const clearPostData = async () => {
//     const posts = await getPosts();
//     const data = posts.map(post => {
//         const title_crop = post.title.substring(0, 20) + '...';
//         post = { ...post, title_crop };
//         return post;
//     })
//     return data;
// };

// const combineData = async () => {
//     const resUsers = await clearUserData();
//     const resPosts = await clearPostData();

//     const data = resUsers.map(user => {
//         user = {...user, posts: []}
//         resPosts.forEach(post => {
//             if (user.id == post.userId) {
//                 delete post.userId;
//                 user.posts.push(post)
//             }
//         }); 
//         return user;
//     });
//     return data;
// };


// const bonusFunction = async () => {
//     const data = await combineData();
//     data.forEach(user => {
//         if (user.name == 'Ervin Howell') {
//             const result = user.posts.map(async userPost => {
//                 const comments = await getComments(userPost.id);
//                 userPost = { ...userPost, comments };
//                 return userPost;
//             });

//             Promise.all(result).then(res => {
//                 user.posts = res;
//                 console.dir(data, {depth: null});                               
//             });
//         }
//     })
// }

// bonusFunction();