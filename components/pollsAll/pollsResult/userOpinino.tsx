'use client';

import React, { useState, useEffect } from 'react';
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
import { supabaseClient } from '@/lib/supabase';
import jsPDF from 'jspdf';

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
	voterName: string;
	avatar: string;
	rating: number | null;
	timestamp: string;
	feedback: string;
	options: string[];
	optionCount?: number;
}

const avatarColors = {
	E: 'bg-blue-500',
	J: 'bg-green-500',
	A: 'bg-gray-400',
	M: 'bg-orange-500',
};

interface UserOpinionProps {
	poll?: { 
		id?: string;
		title: string 
	};
}

export default function UserOpinion({ poll }: UserOpinionProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredFeedback, setFilteredFeedback] = useState<FeedbackResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [allFeedback, setAllFeedback] = useState<FeedbackResponse[]>([]);
	const [optionVotes, setOptionVotes] = useState<Record<string, number>>({});
	const [optionLabels, setOptionLabels] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);

	// Fetch poll responses from Supabase
	useEffect(() => {
		const fetchResponses = async () => {
			if (!poll?.id) {
				console.log('Poll ID not available:', poll?.id);
				setLoading(false);
				return;
			}

			try {
				setError(null);
				console.log('Fetching responses for poll:', poll.id);

				// Fetch poll options first to map IDs to positions
				const { data: optionsData, error: optionsError } = await supabaseClient
					.from('poll_options')
					.select('id, "order", text')
					.eq('poll_id', poll.id)
					.order('order', { ascending: true });

				if (optionsError) {
					console.error('Options fetch error:', optionsError);
					throw optionsError;
				}

				console.log('Fetched options:', optionsData);

				// Create objects instead of Maps
				const optionPositionMap: Record<string, number> = {};
				const optionLabelMap: Record<string, string> = {};
				const optionVoteMap: Record<string, number> = {};
				
				(optionsData || []).forEach((option: any, index: number) => {
					optionPositionMap[option.id] = index + 1;
					optionLabelMap[option.id] = option.text || `Option ${index + 1}`;
					optionVoteMap[option.id] = 0;
				});

				console.log('Option maps created:', { optionLabelMap, optionVoteMap });

				// Fetch poll responses
				const { data, error } = await supabaseClient
					.from('poll_responses')
					.select('*')
					.eq('poll_id', poll.id)
					.order('created_at', { ascending: false });

				if (error) {
					console.error('Responses fetch error:', error);
					throw error;
				}

				console.log('Fetched responses:', data);

				// Transform Supabase data to FeedbackResponse format
				const formattedResponses: FeedbackResponse[] = (data || []).map((response: any) => {
					const email = response.voter_email || 'anonymous@poll.local';
					const firstLetter = email.charAt(0).toUpperCase();
					
					// Convert selected_option_ids to human-readable format (Option 1, Option 2, etc.)
					const optionLabels: string[] = [];
					if (response.selected_option_ids && Array.isArray(response.selected_option_ids)) {
						response.selected_option_ids.forEach((optionId: string) => {
							const position = optionPositionMap[optionId];
							if (position) {
								optionLabels.push(`Option ${position}`);
							}
							// Count votes for each option
							optionVoteMap[optionId] = (optionVoteMap[optionId] || 0) + 1;
						});
					}
					
					return {
						id: response.id,
						email: email,
						voterName: response.voter_name || 'Anonymous',
						avatar: firstLetter,
						rating: response.rating,
						timestamp: response.created_at ? formatTimeAgo(new Date(response.created_at)) : 'Recently',
						feedback: response.feedback_message || '',
						options: optionLabels,
						optionCount: response.selected_option_ids?.length || 0,
					};
				});

				console.log('Formatted responses:', formattedResponses);

				setAllFeedback(formattedResponses);
				setFilteredFeedback(formattedResponses);
				setOptionVotes(optionVoteMap);
				setOptionLabels(optionLabelMap);
			} catch (error: any) {
				console.error('Error fetching poll responses:', error);
				setError(error?.message || 'Failed to load feedback');
				setAllFeedback([]);
				setFilteredFeedback([]);
			} finally {
				setLoading(false);
			}
		};

		fetchResponses();
	}, [poll?.id]);

	// Helper function to format time ago
	const formatTimeAgo = (date: Date): string => {
		const now = new Date();
		const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
		
		if (seconds < 60) return 'Just now';
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
		if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
		return date.toLocaleDateString();
	};

	const handleSearch = (value: string) => {
		setSearchQuery(value);
		const filtered = allFeedback.filter(
			(item) =>
				item.voterName.toLowerCase().includes(value.toLowerCase()) ||
				item.email.toLowerCase().includes(value.toLowerCase()) ||
				item.feedback.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredFeedback(filtered);
	};

	const handleExport = () => {
		// Create PDF
		const pdf = new jsPDF();
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();
		let yPosition = 15;
		const leftMargin = 15;
		const rightMargin = 15;
		const contentWidth = pageWidth - leftMargin - rightMargin;
		const lineHeight = 5;

		// Helper functions
		const addText = (text: string, size: number = 11, isBold: boolean = false) => {
			pdf.setFontSize(size);
			pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
			const lines = pdf.splitTextToSize(text, contentWidth);
			pdf.text(lines, leftMargin, yPosition);
			yPosition += lines.length * lineHeight;
		};

		const checkPageBreak = (heightNeeded: number = 10) => {
			if (yPosition + heightNeeded > pageHeight - 10) {
				pdf.addPage();
				yPosition = 15;
			}
		};

		// Title
		addText(`Poll Report: ${poll?.title || 'Poll'}`, 16, true);
		yPosition += 3;

		// Summary Statistics Section
		checkPageBreak(30);
		addText('SUMMARY STATISTICS', 12, true);
		yPosition += 2;

		const totalVotes = filteredFeedback.length;
		const ratingsArray = filteredFeedback
			.filter((f) => f.rating !== null)
			.map((f) => f.rating as number);
		const averageRating =
			ratingsArray.length > 0
				? (ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length).toFixed(2)
				: 'N/A';

		addText(`Total Votes: ${totalVotes}`, 11, false);
		addText(
			`Average Rating: ${averageRating}${averageRating !== 'N/A' ? '/5' : ''}`,
			11,
			false
		);
		yPosition += 3;

		// Option Votes
		addText('Votes per Option:', 11, true);
		Object.entries(optionVotes).forEach(([optionId, votes]) => {
			const optionLabel = optionLabels[optionId] || optionId;
			addText(`  • ${optionLabel}: ${votes} vote(s)`, 10, false);
		});
		yPosition += 5;

		// Add page break before responses
		pdf.addPage();
		yPosition = 15;

		// Responses List Section (name, email, feedback, rating, vote format)
		addText('RESPONSES', 12, true);
		yPosition += 5;

		// Responses entries in requested format
		filteredFeedback.forEach((response, index) => {
			checkPageBreak(25);

			// Response entry with requested format
			addText(`name: ${response.voterName}`, 10, false);
			addText(`email: ${response.email}`, 10, false);
			if (response.feedback) {
				addText(`feedback: "${response.feedback}"`, 10, false);
			} else {
				addText(`feedback: ""`, 10, false);
			}
			if (response.rating !== null) {
				addText(`rating: ${response.rating}`, 10, false);
			}
			if (response.options && response.options.length > 0) {
				addText(`vote: ${response.options.join(', ')}`, 10, false);
			} else {
				addText(`vote: N/A`, 10, false);
			}

			yPosition += 3;
		});

		// Save PDF
		pdf.save(`poll-report-${poll?.id || 'export'}.pdf`);
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
						disabled={loading || filteredFeedback.length === 0}
					>
						<Download className="w-3 h-3" />
						Export
					</Button>
				</div>
				<p className="text-xs text-gray-500">
					{filteredFeedback.length} responses for &apos;{poll?.title || 'Poll'}&apos;
				</p>
				{error && (
					<p className="text-xs text-red-500 mt-1">{error}</p>
				)}
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
			{loading ? (
				<div className="text-center py-8">
					<p className="text-xs text-gray-500">Loading feedback...</p>
				</div>
			) : error && filteredFeedback.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-xs text-red-500">Error: {error}</p>
					<p className="text-xs text-gray-500 mt-2">Please check the browser console for more details.</p>
				</div>
			) : filteredFeedback.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-xs text-gray-500">No feedback found matching your search.</p>
				</div>
			) : (
				filteredFeedback.map((response) => (
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
									<p className="font-medium text-gray-900 text-xs">{response.voterName}</p>
									<p className="text-xs text-gray-500">{response.email}</p>
									<p className="text-xs text-gray-400">{response.timestamp}</p>
								</div>
							</div>
							{response.rating !== null && (
								<div className="flex items-center gap-0.5">
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`w-3 h-3 ${
													i < Math.floor(response.rating || 0)
														? 'fill-yellow-400 text-yellow-400'
														: i < (response.rating || 0)
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
							)}
						</div>

						{/* Options Tags */}
						{response.options && response.options.length > 0 && (
							<div className="flex items-center gap-1.5 mb-2 flex-wrap">
								{response.options.map((option, idx) => (
									<span
										key={idx}
										className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded"
									>
										{typeof option === 'string' ? option : `Option ${idx + 1}`}
									</span>
								))}
							</div>
						)}

						{/* Feedback Text */}
						{response.feedback && (
							<p className="text-xs text-gray-700 leading-relaxed">
								{response.feedback}
							</p>
						)}
					</div>
				))
			)}
			</div>
		</div>
		</>
	);
}