"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import PostPreview from '@/components/PostPreview';
import PostForm from '@/components/PostForm';
import { ArrowLeft } from 'lucide-react';

const topics = [
	{
		name: 'Calculus',
		slug: 'calculus',
		description:
			'Master the fundamentals of differential and integral calculus, limits, derivatives, and integrals.',
		image:
			'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop',
	},
	{
		name: 'Linear Algebra',
		slug: 'linear-algebra',
		description:
			'Explore vectors, matrices, eigenvalues, and vector spaces in this essential math topic.',
		image:
			'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=250&fit=crop',
	},
	{
		name: 'Classical Mechanics',
		slug: 'classical-mechanics',
		description:
			'Learn Newton\'s laws, kinematics, dynamics, and the principles of motion.',
		image:
			'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
	},
	{
		name: 'Electromagnetism',
		slug: 'electromagnetism',
		description:
			'Dive into electric fields, magnetic fields, circuits, and electromagnetic waves.',
		image:
			'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=250&fit=crop',
	},
	{
		name: 'Organic Chemistry',
		slug: 'organic-chemistry',
		description: 'Study carbon compounds, reactions, and the chemistry of life.',
		image:
			'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
	},
	{
		name: 'Inorganic Chemistry',
		slug: 'inorganic-chemistry',
		description:
			'Understand metals, minerals, and non-carbon based chemical compounds.',
		image:
			'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=250&fit=crop',
	},
	{
		name: 'Data Structures',
		slug: 'data-structures',
		description:
			'Learn arrays, linked lists, trees, graphs, and efficient data organization.',
		image:
			'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
	},
	{
		name: 'Algorithms',
		slug: 'algorithms',
		description:
			'Master sorting, searching, dynamic programming, and algorithmic problem-solving.',
		image:
			'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
	},
];

const TopicPage = () => {
	const params = useParams();
	const slug = params.slug as string;
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isPostFormOpen, setIsPostFormOpen] = useState(false);

	const topic = topics.find((t) => t.slug === slug);

	const fetchPosts = async () => {
		try {
			const response = await fetch(`/api/posts?topic=${slug}`);
			if (response.ok) {
				const data = await response.json();
				setPosts(data);
			}
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (slug) {
			fetchPosts();
		}
	}, [slug]);

	const handleUpvote = async (postId: string) => {
		// TODO: Implement voting API
		console.log('Upvote', postId);
	};

	const handleDownvote = async (postId: string) => {
		// TODO: Implement voting API
		console.log('Downvote', postId);
	};

	if (!topic) {
		return (
			<div className="min-h-screen bg-background">
				<NavBar />
				<div className="container mx-auto px-4 py-8">
					<p>Topic not found.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<NavBar />
			<div className="container mx-auto px-4 py-8">
				<Link
					href="/explore"
					className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
				>
					<ArrowLeft className="w-5 h-5 mr-2" />
					Back to Explore
				</Link>

				<div className="mb-12 text-center">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">{topic.name}</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						{topic.description}
					</p>
					<div className="mt-6 flex justify-center">
						<div className="bg-white rounded-full px-6 py-3 shadow-md">
							<span className="text-gray-700 font-medium">
								Community Discussions
							</span>
						</div>
					</div>
				</div>

				<div className="mb-8 flex justify-center">
					<button
						onClick={() => setIsPostFormOpen(true)}
						className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
					>
						✏️ Share Your Knowledge
					</button>
				</div>

				<div className="max-w-4xl mx-auto">
					{loading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<p className="text-gray-600">Loading posts...</p>
						</div>
					) : posts.length > 0 ? (
						<div className="space-y-4">
							{posts.map((post: any) => (
								<PostPreview
									key={post._id}
									id={post._id}
									title={post.title}
									content={post.content}
									user={post.userDisplayName}
									upvotes={post.upvotes}
									downvotes={post.downvotes}
									createdAt={post.createdAt}
									onUpvote={() => handleUpvote(post._id)}
									onDownvote={() => handleDownvote(post._id)}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-16 bg-white rounded-2xl shadow-lg">
							<div className="text-6xl mb-4">📚</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-2">
								No posts yet
							</h3>
							<p className="text-gray-600 mb-6">
								Be the first to share knowledge in this topic!
							</p>
							<button
								onClick={() => setIsPostFormOpen(true)}
								className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
							>
								Create First Post
							</button>
						</div>
					)}
				</div>

				<PostForm
					topic={slug}
					isOpen={isPostFormOpen}
					onClose={() => setIsPostFormOpen(false)}
					onPost={fetchPosts}
				/>
			</div>
		</div>
	);
};

export default TopicPage;