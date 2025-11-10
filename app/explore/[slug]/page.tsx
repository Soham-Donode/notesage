"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import PostPreview from '@/components/PostPreview';
import PostForm from '@/components/PostForm';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import SearchOverlay from '@/components/SearchOverlay';

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
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const { theme } = useTheme();

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

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				setIsSearchOpen(true);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleUpvote = async (postId: string) => {
		try {
			const response = await fetch('/api/posts/vote', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ postId, voteType: 'upvote' }),
			});

			if (response.ok) {
				const data = await response.json();
				// Update the post in state
				setPosts(posts.map(post =>
					post._id === postId
						? { ...post, upvotes: data.upvotes, downvotes: data.downvotes }
						: post
				));
			}
		} catch (error) {
			console.error('Error upvoting:', error);
		}
	};

	const handleDownvote = async (postId: string) => {
		try {
			const response = await fetch('/api/posts/vote', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ postId, voteType: 'downvote' }),
			});

			if (response.ok) {
				const data = await response.json();
				// Update the post in state
				setPosts(posts.map(post =>
					post._id === postId
						? { ...post, upvotes: data.upvotes, downvotes: data.downvotes }
						: post
				));
			}
		} catch (error) {
			console.error('Error downvoting:', error);
		}
	};

	if (!topic) {
		return (
			<div className="min-h-screen bg-background">
				<NavBar onSearchClick={() => setIsSearchOpen(true)} />
				<div className="container mx-auto px-4 py-8">
					<p>Topic not found.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted transition-colors duration-300">
			<NavBar onSearchClick={() => setIsSearchOpen(true)} />
			<div className="container mx-auto px-4 py-6 sm:py-8">
				<Link
					href="/explore"
					className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors"
				>
					<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
					Back to Explore
				</Link>

				<div className="mb-8 sm:mb-12 text-center">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 transition-colors duration-300">{topic.name}</h1>
					<p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto transition-colors duration-300 px-4">
						{topic.description}
					</p>
				</div>

				<div className="mb-6 sm:mb-8 flex justify-center">
					<button
						onClick={() => setIsPostFormOpen(true)}
						className="border border-white/50 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover-scale text-sm sm:text-base"
					>
						✏️ Share Your Knowledge
					</button>
				</div>

				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					{loading ? (
						<div className="text-center py-8 sm:py-12">
							<div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4 transition-colors duration-300"></div>
							<p className="text-muted-foreground transition-colors duration-300">Loading posts...</p>
						</div>
					) : posts.length > 0 ? (
						<div className="space-y-3 sm:space-y-4 lg:space-y-6">
							{posts.map((post: any) => (
								<PostPreview
									key={post._id}
									id={post._id}
									title={post.title}
									content={post.content}
									user={post.userDisplayName}
									upvotes={post.upvotes}
									downvotes={post.downvotes}
									comments={post.comments}
									createdAt={post.createdAt}
									onUpvote={() => handleUpvote(post._id)}
									onDownvote={() => handleDownvote(post._id)}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12 sm:py-16 bg-card rounded-2xl shadow-lg border border-border transition-all duration-300">
							<div className="text-5xl sm:text-6xl mb-4">📚</div>
							<h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2 transition-colors duration-300">
								No posts yet
							</h3>
							<p className="text-muted-foreground mb-4 sm:mb-6 transition-colors duration-300 px-4">
								Be the first to share knowledge in this topic!
							</p>
							<button
								onClick={() => setIsPostFormOpen(true)}
								className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover-scale text-sm sm:text-base"
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
			<SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
		</div>
	);
};

export default TopicPage;