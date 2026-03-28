'use client';

import React, { useState } from 'react';
import { Download, Search, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const scrollbarStyles = `
	.hover-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: transparent transparent;
	}
	
	.hover-scrollbar:hover {
		scrollbar-color: #d1d5db #f3f4f6;
	}
	
	.hover-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	
	.hover-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	
	.hover-scrollbar::-webkit-scrollbar-thumb {
		background-color: transparent;
		border-radius: 3px;
	}
	
	.hover-scrollbar:hover::-webkit-scrollbar-thumb {
		background-color: #d1d5db;
	}
`;

interface FeedbackResponse {
	id: string;
	email: string;
	avatar: string;
	rating: number;
	timestamp: string;
	feedback: string;
	options: string[];
}

const feedbackData: FeedbackResponse[] = [
	{
		id: '1',
		email: 'exampla@gamil.com',
		avatar: 'E',
		rating: 3.5,
		timestamp: '1 day ago',
		feedback:
			'"The proposed location is excellent, but we should consider timing to avoid peak heat hours."',
		options: ['Option 1', 'Option 2'],
	},
	{
		id: '2',
		email: 'jordan.smith@work.io',
		avatar: 'J',
		rating: 5.0,
		timestamp: '3 days ago',
		feedback:
			'"Extremely excited about the beach activity! Looking forward to it!"',
		options: ['Option 2', 'Option 4'],
	},
	{
		id: '3',
		email: 'anonymous@guest.com',
		avatar: 'A',
		rating: 2.0,
		timestamp: 'Yesterday',
		feedback:
			'"The budget seems a bit high. Maybe scale back duration and increase quality?"',
		options: ['Option 1'],
	},
	{
		id: '4',
		email: 'mike.ross@legal.com',
		avatar: 'M',
		rating: 4.0,
		timestamp: '7 days ago',
		feedback:
			'"Excellent choice overall. I\'d love to see more team building options in the afternoon."',
		options: ['Option 3'],
	},
];

const avatarColors = {
	E: 'bg-blue-500',
	J: 'bg-green-500',
	A: 'bg-gray-400',
	M: 'bg-orange-500',
};

interface UserOpinionProps {
	poll?: { title: string };
}

export default function UserOpinion({ poll }: UserOpinionProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredFeedback, setFilteredFeedback] = useState(feedbackData);

	const handleSearch = (value: string) => {
		setSearchQuery(value);
		const filtered = feedbackData.filter(
			(item) =>
				item.email.toLowerCase().includes(value.toLowerCase()) ||
				item.feedback.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredFeedback(filtered);
	};

	const handleExport = () => {
		// Export functionality
		const exportData = feedbackData.map((item) => ({
			email: item.email,
			rating: item.rating,
			feedback: item.feedback,
			timestamp: item.timestamp,
		}));
		const jsonString = JSON.stringify(exportData, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'voter-feedback.json';
		a.click();
	};

	return (
		<>
			<style>{scrollbarStyles}</style>
			<div className="w-full h-screen bg-white p-4 flex flex-col">
			{/* Header Section */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-lg font-bold text-gray-900">Voter Feedback</h1>
					<Button
						onClick={handleExport}
						className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-xs py-1 h-8"
					>
						<Download className="w-3 h-3" />
						Export
					</Button>
				</div>
				<p className="text-xs text-gray-500">
					128 responses for &apos;{poll?.title || 'Annual Team Summer Retreat 2024'}&apos;
				</p>
			</div>

			{/* Filter and Search Section */}
			<div className="flex items-center justify-between mb-4">
				<div className="relative flex-1">
				<Search className="absolute left-3 top-2 w-4 h-4 text-gray-400" />
				<Input
					placeholder="Search responses..."
					value={searchQuery}
					onChange={(e) => handleSearch(e.target.value)}
					className="pl-9 border-gray-300 text-xs"
				/>
			</div>
			</div>

			{/* Feedback List */}
		<div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-15 hover-scrollbar">
				{filteredFeedback.map((response) => (
					<div
						key={response.id}
						className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition"
					>
						{/* User Info and Rating */}
						<div className="flex items-start justify-between mb-2">
							<div className="flex items-center gap-2">
								<Avatar className="w-8 h-8">
									<AvatarFallback
										className={`${
											avatarColors[response.avatar as keyof typeof avatarColors] ||
											'bg-gray-400'
										} text-white font-semibold text-xs`}
									>
										{response.avatar}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium text-gray-900 text-xs">{response.email}</p>
									<p className="text-xs text-gray-500">{response.timestamp}</p>
								</div>
							</div>
								<div className="flex items-center gap-0.5">
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-3 h-3 ${
													i < Math.floor(response.rating)
														? 'fill-yellow-400 text-yellow-400'
														: i < response.rating
															? 'fill-yellow-400 text-yellow-400 opacity-50'
															: 'text-gray-300'
												}`}
											/>
										))}
									</div>
									<span className="text-xs font-semibold text-gray-700 ml-0.5">
									{response.rating}
								</span>
							</div>
						</div>

						{/* Options Tags */}
						<div className="flex items-center gap-1.5 mb-2">
							{response.options.map((option, idx) => (
								<span
									key={idx}
									className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded"
								>
									{option}
								</span>
							))}
						</div>

						{/* Feedback Text */}
						<p className="text-xs text-gray-700 leading-relaxed">
							{response.feedback}
						</p>
					</div>
				))}
			</div>

			{/* No Results */}
			{filteredFeedback.length === 0 && (
				<div className="text-center py-8">
					<p className="text-xs text-gray-500">No feedback found matching your search.</p>
				</div>
			)}
		</div>
		</>
	);
}