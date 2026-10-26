
const users = [
    {
        username: 'alice_wonder',
        email: 'alice@example.com',
        fullname: 'Alice Wonderland',
        bio: 'Curiouser and curiouser!',
        isPrivate: false,
        createdAt: new Date('2024-01-01T10:00:00Z')
    },
    {
        username: 'bob_builder',
        email: 'bob@example.com',
        fullname: 'Bob Builder',
        bio: 'Can we fix it? Yes we can!',
        isPrivate: false,
        createdAt: new Date('2024-01-02T11:00:00Z')
    },
    {
        username: 'charlie_chap',
        email: 'charlie@example.com',
        fullname: 'Charlie Chaplin',
        bio: 'A day without laughter is a day wasted.',
        isPrivate: true,
        createdAt: new Date('2024-01-03T12:00:00Z')
    },
    {
        username: 'diana_prince',
        email: 'diana@example.com',
        fullname: 'Diana Prince',
        bio: 'Fighting for justice.',
        isPrivate: false,
        createdAt: new Date('2024-01-04T09:00:00Z')
    },
    {
        username: 'eve_online',
        email: 'eve@example.com',
        fullname: 'Eve Online',
        bio: 'Living in the matrix.',
        isPrivate: true,
        createdAt: new Date('2024-01-05T08:00:00Z')
    },
    {
        username: 'frank_ocean',
        email: 'frank@example.com',
        fullname: 'Frank Ocean',
        bio: 'Music is my life.',
        isPrivate: false,
        createdAt: new Date('2024-01-06T14:00:00Z')
    },
    {
        username: 'grace_hopper',
        email: 'grace@example.com',
        fullname: 'Grace Hopper',
        bio: 'The most dangerous phrase: we have always done it this way.',
        isPrivate: false,
        createdAt: new Date('2024-01-07T13:00:00Z')
    },
    {
        username: 'henry_ford',
        email: 'henry@example.com',
        fullname: 'Henry Ford',
        bio: 'Anyone who stops learning is old.',
        isPrivate: true,
        createdAt: new Date('2024-01-08T10:00:00Z')
    },
    {
        username: 'iris_west',
        email: 'iris@example.com',
        fullname: 'Iris West',
        bio: 'Chasing stories and the fastest man alive.',
        isPrivate: false,
        createdAt: new Date('2024-01-09T11:00:00Z')
    },
    {
        username: 'jack_sparrow',
        email: 'jack@example.com',
        fullname: 'Jack Sparrow',
        bio: 'Not all treasure is silver and gold, mate.',
        isPrivate: false,
        createdAt: new Date('2024-01-10T15:00:00Z')
    },
    {
        username: 'karen_page',
        email: 'karen@example.com',
        fullname: 'Karen Page',
        bio: 'The truth matters.',
        isPrivate: true,
        createdAt: new Date('2024-01-11T09:00:00Z')
    },
    {
        username: 'leo_messi',
        email: 'leo@example.com',
        fullname: 'Leo Messi',
        bio: 'Every year I try to grow as a player.',
        isPrivate: false,
        createdAt: new Date('2024-01-12T16:00:00Z')
    }
];

const posts = [
    {
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        caption: 'Sunrise over the mountains. Pure bliss!',
        location: 'Alps',
        createdAt: new Date('2024-02-01T06:00:00Z'),
        updatedAt: new Date('2024-02-01T06:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        caption: 'Beach day with perfect waves.',
        location: 'Malibu',
        createdAt: new Date('2024-02-02T10:00:00Z'),
        updatedAt: new Date('2024-02-02T10:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
        caption: 'Weekend hiking adventure!',
        location: 'Goa',
        createdAt: new Date('2024-02-03T08:00:00Z'),
        updatedAt: new Date('2024-02-03T08:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
        caption: 'Best pasta I have ever had.',
        location: 'Rome',
        createdAt: new Date('2024-02-04T13:00:00Z'),
        updatedAt: new Date('2024-02-04T13:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
        caption: 'City lights at night.',
        location: 'New York',
        createdAt: new Date('2024-02-05T21:00:00Z'),
        updatedAt: new Date('2024-02-05T21:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6',
        caption: 'Forest walk to clear my mind.',
        location: 'Black Forest',
        createdAt: new Date('2024-02-06T09:00:00Z'),
        updatedAt: new Date('2024-02-06T09:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
        caption: 'Tokyo vibes are unmatched.',
        location: 'Tokyo',
        createdAt: new Date('2024-02-07T14:00:00Z'),
        updatedAt: new Date('2024-02-07T14:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
        caption: 'Sunflower fields forever.',
        location: 'Provence',
        createdAt: new Date('2024-02-08T11:00:00Z'),
        updatedAt: new Date('2024-02-08T11:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
        caption: 'Snow capped peaks calling my name.',
        location: 'Alps',
        createdAt: new Date('2024-02-09T07:00:00Z'),
        updatedAt: new Date('2024-02-09T07:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
        caption: 'Island hopping in Greece.',
        location: 'Santorini',
        createdAt: new Date('2024-02-10T12:00:00Z'),
        updatedAt: new Date('2024-02-10T12:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        caption: 'Street food is the best food.',
        location: 'Bangkok',
        createdAt: new Date('2024-02-11T18:00:00Z'),
        updatedAt: new Date('2024-02-11T18:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
        caption: 'Morning coffee in the garden.',
        location: 'Paris',
        createdAt: new Date('2024-02-12T08:00:00Z'),
        updatedAt: new Date('2024-02-12T08:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206',
        caption: 'Surf is up!',
        location: 'Bali',
        createdAt: new Date('2024-02-13T09:00:00Z'),
        updatedAt: new Date('2024-02-13T09:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
        caption: 'Northern lights are breathtaking.',
        location: 'Iceland',
        createdAt: new Date('2024-02-14T22:00:00Z'),
        updatedAt: new Date('2024-02-14T22:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be',
        caption: 'Australian outback road trip.',
        location: 'Goa',
        createdAt: new Date('2024-02-15T10:00:00Z'),
        updatedAt: new Date('2024-02-15T10:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856',
        caption: 'Hammock life is the best life.',
        location: 'Costa Rica',
        createdAt: new Date('2024-02-16T15:00:00Z'),
        updatedAt: new Date('2024-02-16T15:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090',
        caption: 'Dubai skyline never gets old.',
        location: 'Dubai',
        createdAt: new Date('2024-02-17T20:00:00Z'),
        updatedAt: new Date('2024-02-17T20:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f',
        caption: 'Cherry blossoms in full bloom.',
        location: 'Tokyo',
        createdAt: new Date('2024-02-18T11:00:00Z'),
        updatedAt: new Date('2024-02-18T11:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd',
        caption: 'Camping under the stars.',
        location: 'Patagonia',
        createdAt: new Date('2024-02-19T19:00:00Z'),
        updatedAt: new Date('2024-02-19T19:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65',
        caption: 'Hidden waterfall found after a long hike.',
        location: 'New Zealand',
        createdAt: new Date('2024-02-20T14:00:00Z'),
        updatedAt: new Date('2024-02-20T14:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1521651201144-634f700b36ef',
        caption: 'Rooftop sunset in Barcelona.',
        location: 'Barcelona',
        createdAt: new Date('2024-02-21T19:30:00Z'),
        updatedAt: new Date('2024-02-21T19:30:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
        caption: 'Misty lake morning.',
        location: 'Scotland',
        createdAt: new Date('2024-02-22T06:30:00Z'),
        updatedAt: new Date('2024-02-22T06:30:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
        caption: 'London calling.',
        location: 'London',
        createdAt: new Date('2024-02-23T12:00:00Z'),
        updatedAt: new Date('2024-02-23T12:00:00Z')
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
        caption: 'Cape Town is absolutely stunning.',
        location: 'Cape Town',
        createdAt: new Date('2024-02-24T10:00:00Z'),
        updatedAt: new Date('2024-02-24T10:00:00Z')
    }
];

module.exports = { users, posts };
