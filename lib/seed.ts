import dbConnect from './mongodb';
import Post from '../models/Post';
import User from '../models/User';

const seedPosts = async () => {
  await dbConnect();

  // Get a user or create one
  let user = await User.findOne();
  if (!user) {
    user = await User.create({
      authProvider: { provider: 'clerk', providerUserId: 'fake-user' },
      email: 'fake@example.com',
      displayName: 'Fake User',
      profile: {},
    });
  }

  const fakePosts = [
    {
      title: 'Introduction to Calculus',
      content: '# Introduction to Calculus\n\nCalculus is the mathematical study of continuous change. It has two main branches: differential calculus and integral calculus.\n\n## Key Concepts\n- **Limits**: The foundation of calculus\n- **Derivatives**: Rate of change\n- **Integrals**: Accumulation\n\n> Calculus is the art of counting without counting.',
      topic: 'calculus',
      userId: user._id,
      userDisplayName: user.displayName,
    },
    {
      title: 'Linear Algebra Basics',
      content: '# Linear Algebra Basics\n\nLinear algebra is a branch of mathematics concerning linear equations, linear functions, and their representations through matrices and vector spaces.\n\n## Vectors and Matrices\n- Vectors: Ordered lists of numbers\n- Matrices: Rectangular arrays\n\n```math\nA = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}\n```',
      topic: 'linear-algebra',
      userId: user._id,
      userDisplayName: user.displayName,
    },
    {
      title: 'Newton\'s Laws of Motion',
      content: '# Newton\'s Laws of Motion\n\n## First Law\nAn object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.\n\n## Second Law\nForce equals mass times acceleration (F = ma).\n\n## Third Law\nFor every action, there is an equal and opposite reaction.',
      topic: 'classical-mechanics',
      userId: user._id,
      userDisplayName: user.displayName,
    },
    {
      title: 'Electromagnetic Waves',
      content: '# Electromagnetic Waves\n\nElectromagnetic waves are waves that consist of oscillating electric and magnetic fields.\n\n## Properties\n- Travel at speed of light\n- Transverse waves\n- Can travel through vacuum\n\n## Spectrum\n- Radio waves\n- Microwaves\n- Infrared\n- Visible light\n- Ultraviolet\n- X-rays\n- Gamma rays',
      topic: 'electromagnetism',
      userId: user._id,
      userDisplayName: user.displayName,
    },
    {
      title: 'Organic Chemistry Fundamentals',
      content: '# Organic Chemistry Fundamentals\n\nOrganic chemistry is the study of the structure, properties, composition, reactions, and preparation of carbon-containing compounds.\n\n## Hydrocarbons\n- Alkanes: Saturated\n- Alkenes: Double bonds\n- Alkynes: Triple bonds\n\n## Functional Groups\n- Alcohols: -OH\n- Aldehydes: -CHO\n- Ketones: -C=O',
      topic: 'organic-chemistry',
      userId: user._id,
      userDisplayName: user.displayName,
    },
    {
      title: 'Inorganic Chemistry Overview',
      content: '# Inorganic Chemistry Overview\n\nInorganic chemistry deals with the synthesis and behavior of inorganic and organometallic compounds.\n\n## Main Groups\n- Metals and non-metals\n- Coordination compounds\n- Bioinorganic chemistry\n\n## Applications\n- Catalysts\n- Materials science\n- Environmental chemistry',
      topic: 'inorganic-chemistry',
      userId: user._id,
      userDisplayName: user.displayName,
    },
    {
      title: 'Introduction to Data Structures',
      content: '# Introduction to Data Structures\n\nData structures are ways of organizing and storing data efficiently.\n\n## Basic Structures\n- Arrays\n- Linked Lists\n- Stacks and Queues\n\n## Advanced Structures\n- Trees (Binary, AVL, Red-Black)\n- Graphs\n- Hash Tables\n\n## Time Complexity\nUnderstanding Big O notation is crucial for choosing the right data structure.',
      topic: 'data-structures',
      userId: user._id,
      userDisplayName: user.displayName,
    },
    {
      title: 'Algorithm Design Paradigms',
      content: '# Algorithm Design Paradigms\n\nAlgorithms can be classified based on their design approach.\n\n## Divide and Conquer\n- Merge Sort\n- Quick Sort\n- Binary Search\n\n## Dynamic Programming\n- Fibonacci\n- Knapsack Problem\n- Longest Common Subsequence\n\n## Greedy Algorithms\n- Huffman Coding\n- Kruskal\'s Algorithm\n- Dijkstra\'s Shortest Path',
      topic: 'algorithms',
      userId: user._id,
      userDisplayName: user.displayName,
    },
  ];

  for (const postData of fakePosts) {
    const existing = await Post.findOne({ title: postData.title });
    if (!existing) {
      await Post.create(postData);
      console.log(`Created post: ${postData.title}`);
    }
  }

  console.log('Seeding complete');
};

export default seedPosts;