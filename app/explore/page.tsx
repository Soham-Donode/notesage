"use client";

import React from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import Image from 'next/image';

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
		description: 'Learn Newton\'s laws, kinematics, dynamics, and the principles of motion.',
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

const page = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<NavBar />
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-900 mb-4">
						Explore Topics
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Discover and share knowledge across various academic disciplines
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
					{topics.map((topic) => (
						<Link key={topic.slug} href={`/explore/${topic.slug}`}>
							<div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 border border-gray-100">
								<div className="relative h-56">
									<Image
										src={topic.image}
										alt={topic.name}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
									<div className="absolute bottom-6 left-6 right-6">
										<h2 className="text-white text-2xl font-bold mb-3 drop-shadow-lg">{topic.name}</h2>
										<p className="text-white/90 text-sm leading-relaxed drop-shadow-md">{topic.description}</p>
									</div>
									<div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
										<span className="text-white text-sm font-medium">Explore</span>
									</div>
								</div>
								<div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
									<div className="flex items-center justify-between">
										<div className="flex items-center text-sm text-gray-600">
											<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
											Active Community
										</div>
										<div className="text-blue-600 font-semibold text-sm">View Posts →</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default page;