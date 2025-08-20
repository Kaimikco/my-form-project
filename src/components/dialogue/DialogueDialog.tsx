'use client'

import { tv } from "tailwind-variants"
import { ComponentProps, useEffect } from "react";
import { NPC } from "@/types/Town";
import { TypewriterDialogue } from "../typewriter-dialogue/TypeWriterDialogue";
import { Heading } from "../heading/Heading";
import { useDialogueStore } from "./store";
import { Dialog } from "../dialog/Dialog";
import { Button } from "../button/Button";

const dialogueDialogStyles = tv({
	base: "bg-gray-800 text-white text-2xl border-4 border-white p-4 max-h-[200px] overflow-auto",
});

const historyStyles = tv({
	base: "text-gray-300 text-lg mb-4 border-b border-gray-600 pb-2",
});

export type DialogueDialogProps = Omit<ComponentProps<typeof Dialog>, 'size' | 'position' | 'children'> & {
	npc: NPC
}

export function DialogueDialog({
	npc,
	open,
	onOpenChange,
	...rest
}: DialogueDialogProps) {

	const {
		currentTopic,
		currentNode,
		activeNpcText,
		dialoguePhase,
		topicHistory,
		startDialogue,
		selectTopic,
		selectPlayerOption,
		onTypewriterComplete
	} = useDialogueStore();

	// Debug logging
	console.log('DialogueDialog Debug:', {
		dialoguePhase,
		currentTopic: currentTopic?.title,
		currentNode: !!currentNode,
		activeNpcText,
		topicHistoryLength: topicHistory.length,
		showTopics: dialoguePhase === 'awaiting-topic',
		showPlayerOptions: dialoguePhase === 'awaiting-player-choice' && currentNode
	});

	// Initialize dialogue when NPC changes or dialog opens
	useEffect(() => {
		if (npc?.dialogue && open) {
			startDialogue(npc);
		}
	}, [npc, open, startDialogue]);

	if (!npc?.dialogue) {
		return null;
	}

	const { topics } = npc.dialogue;

	// Filter available topics based on conditions
	const availableTopics = topics?.filter(topic => 
		!topic.isAvailable || topic.isAvailable()
	) || [];

	// const showTopics = dialoguePhase === 'awaiting-topic';
	const showPlayerOptions = dialoguePhase === 'awaiting-player-choice' && currentNode;
	const showHistory = topicHistory.length > 0 && currentTopic;

	return (
		<Dialog
			open={open}
			size="xl"
			position="center"
			closeOnBackdropClick={false}
			closeOnEscape={false}
			onOpenChange={onOpenChange}
			className="h-full"
			{...rest}>
			<div className="flex flex-col h-full gap-4">
				{/* History */}
				<div className="flex h-full gap-4">
					<div className="mb-4 bg-gray-800 border-4 border-white p-4 h-full flex-3">
						{showHistory && (
							topicHistory.map((entry, index) => (
								<div key={index} className={historyStyles()}>
									<div className="mb-1">{entry.npcText}</div>
									<div className="text-red-400 italic">"{entry.playerResponse}"</div>
								</div>
							))
						)}
					</div>	
					
					<div className="flex flex-col gap-4">
						<div className="flex gap-4">
							<Heading 
								color="white" 
								className="bg-gray-800 py-2 px-4 border-4 border-white" 
								level={3}
							>
								{npc.name}
							</Heading>
							{/* {currentTopic && (
								<Heading 
									color="white" 
									className="bg-gray-800 py-2 px-4 border-4 border-white inline-block" 
									level={3}
								>
									{currentTopic.title}
								</Heading>
							)}							 */}
						</div>
						{/* Topics sidebar */}
						<div className="bg-gray-800 border-4 border-white p-4 flex-1 text-2xl text-white">
							<ul className="space-y-2">
								{availableTopics.map((topic) => (
									<li key={topic.id}>
										<button 
											onClick={() => selectTopic(topic)} 
											className="cursor-pointer hover:underline text-left"
										>
											{topic.title}
										</button>
									</li>
								))}
							</ul>
						</div>						
					</div>	
				</div>
				<div className={dialogueDialogStyles()}>
					<div className="flex justify-between">
						<div className="flex flex-col flex-1 h-[400px]">

							{/* Current NPC text */}
							<TypewriterDialogue
								onComplete={onTypewriterComplete}
								text={activeNpcText}
							/>

							{/* Player options */}
							{showPlayerOptions && (
								<div className="mt-4">
									<ul className="space-y-2">
										{currentNode.playerOptions.map((playerOption, index) => (
											<li key={index}>
												<button 
													onClick={() => selectPlayerOption(playerOption)}
													className="text-red-400 hover:text-red-300 cursor-pointer hover:underline text-left"
												>
													"{playerOption.text}"
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex gap-4 items-center justify-between">
					<div>
						<Button onClick={() => onOpenChange?.(false)} className="border-4 text-2xl">Close</Button>
					</div>
				</div>				
			</div>
		</Dialog>
	)
}