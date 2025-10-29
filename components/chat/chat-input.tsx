import type { UseChatHelpers } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
  PromptInputHoverCard,
  PromptInputHoverCardTrigger,
  PromptInputHoverCardContent,
  PromptInputHeader,
  PromptInputSpeechButton,
  PromptInputCommand,
  PromptInputCommandInput,
  PromptInputCommandList,
  PromptInputCommandEmpty,
  PromptInputCommandGroup,
  PromptInputCommandItem,
  usePromptInputAttachments,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ImageIcon,
  SettingsIcon,
  SparklesIcon,
  TrashIcon,
  InfoIcon,
  TrendingUpIcon,
  CodeIcon,
  PlaneIcon,
} from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  status: UseChatHelpers<UIMessage>['status'];
  onClearMessages?: () => void;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  selectedAgent?: string;
  onAgentChange?: (agent: string) => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  status,
  onClearMessages,
  selectedModel: externalSelectedModel,
  onModelChange,
  selectedAgent: externalSelectedAgent,
  onAgentChange,
}: ChatInputProps) {
  const isDisabled = status === 'submitted' || status === 'streaming';
  const [internalSelectedModel, setInternalSelectedModel] =
    useState('gpt-4o-mini');
  const [internalSelectedAgent, setInternalSelectedAgent] = useState(
    'financialAnalystAgent'
  );
  const [showCommands, setShowCommands] = useState(false);
  const selectedModel = externalSelectedModel ?? internalSelectedModel;
  const setSelectedModel = onModelChange ?? setInternalSelectedModel;
  const selectedAgent = externalSelectedAgent ?? internalSelectedAgent;
  const setSelectedAgent = onAgentChange ?? setInternalSelectedAgent;

  // Handle command palette visibility
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    // Show commands when user types /
    setShowCommands(newValue.startsWith('/') && newValue.length > 0);
  };

  // Handle command selection
  const handleCommandSelect = (command: string) => {
    switch (command) {
      case 'financial':
        setSelectedAgent('financialAnalystAgent');
        onChange('');
        break;
      case 'code':
        setSelectedAgent('codeReviewAgent');
        onChange('');
        break;
      case 'travel':
        setSelectedAgent('travelPlanningAgent');
        onChange('');
        break;
      case 'clear':
        onClearMessages?.();
        onChange('');
        break;
    }
    setShowCommands(false);
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <PromptInput onSubmit={onSubmit} accept="image/*" multiple maxFiles={5}>
        <PromptInputHeader className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" />
            <span className="text-sm font-medium">AI Assistant</span>
            <PromptInputHoverCard>
              <PromptInputHoverCardTrigger asChild>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <InfoIcon className="size-4" />
                </button>
              </PromptInputHoverCardTrigger>
              <PromptInputHoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Tips</h4>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Add images by clicking the attachment button</li>
                    <li>• Use / for quick commands</li>
                    <li>• Select different AI models from the dropdown</li>
                    <li>• Press Enter to send, Shift+Enter for new line</li>
                  </ul>
                </div>
              </PromptInputHoverCardContent>
            </PromptInputHoverCard>
          </div>
          <div className="flex items-center gap-2">
            <PromptInputModelSelect
              value={selectedAgent}
              onValueChange={setSelectedAgent}
            >
              <PromptInputModelSelectTrigger className="w-[200px]">
                <PromptInputModelSelectValue placeholder="Select agent" />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                <PromptInputModelSelectItem value="financialAnalystAgent">
                  Financial Analyst
                </PromptInputModelSelectItem>
                <PromptInputModelSelectItem value="codeReviewAgent">
                  Code Review Specialist
                </PromptInputModelSelectItem>
                <PromptInputModelSelectItem value="travelPlanningAgent">
                  Travel Planning Expert
                </PromptInputModelSelectItem>
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
            <PromptInputModelSelect
              value={selectedModel}
              onValueChange={setSelectedModel}
            >
              <PromptInputModelSelectTrigger className="w-[180px]">
                <PromptInputModelSelectValue placeholder="Select model" />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                <PromptInputModelSelectItem value="gpt-4o-mini">
                  GPT-4o Mini (Fast)
                </PromptInputModelSelectItem>
                <PromptInputModelSelectItem value="gpt-4o">
                  GPT-4o (Powerful)
                </PromptInputModelSelectItem>
                <PromptInputModelSelectItem value="gpt-3.5-turbo">
                  GPT-3.5 Turbo (Economy)
                </PromptInputModelSelectItem>
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="size-8">
                  <SettingsIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={onClearMessages}
                  className="text-destructive"
                >
                  <TrashIcon className="mr-2 size-4" />
                  Clear conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PromptInputHeader>

        <PromptInputBody>
          <AttachmentsDisplay />
          {showCommands && (
            <PromptInputCommand className="mb-2">
              <PromptInputCommandInput placeholder="Type a command..." />
              <PromptInputCommandList>
                <PromptInputCommandEmpty>
                  No commands found.
                </PromptInputCommandEmpty>
                <PromptInputCommandGroup heading="Agents">
                  <PromptInputCommandItem
                    onSelect={() => handleCommandSelect('financial')}
                  >
                    <TrendingUpIcon className="mr-2 size-4" />
                    <span>/financial - Switch to Financial Analyst</span>
                  </PromptInputCommandItem>
                  <PromptInputCommandItem
                    onSelect={() => handleCommandSelect('code')}
                  >
                    <CodeIcon className="mr-2 size-4" />
                    <span>/code - Switch to Code Review Specialist</span>
                  </PromptInputCommandItem>
                  <PromptInputCommandItem
                    onSelect={() => handleCommandSelect('travel')}
                  >
                    <PlaneIcon className="mr-2 size-4" />
                    <span>/travel - Switch to Travel Planning Expert</span>
                  </PromptInputCommandItem>
                </PromptInputCommandGroup>
                <PromptInputCommandGroup heading="Actions">
                  <PromptInputCommandItem
                    onSelect={() => handleCommandSelect('clear')}
                  >
                    <TrashIcon className="mr-2 size-4" />
                    <span>/clear - Clear conversation</span>
                  </PromptInputCommandItem>
                </PromptInputCommandGroup>
              </PromptInputCommandList>
            </PromptInputCommand>
          )}
          <PromptInputTextarea
            onChange={handleInputChange}
            placeholder="Analyze financials, review code, plan travel, or try commands with /..."
            value={value}
            disabled={isDisabled}
            aria-label="Message input"
            className="min-h-[60px] resize-none"
          />
        </PromptInputBody>

        <PromptInputFooter className="flex items-center justify-between">
          <PromptInputTools className="flex items-center gap-1">
            <AttachmentsButton disabled={isDisabled} />
            <PromptInputSpeechButton disabled>
              <span className="sr-only">Voice input (coming soon)</span>
            </PromptInputSpeechButton>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={isDisabled || !value.trim()}
            status={status}
            aria-label="Send message"
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

function AttachmentsButton({ disabled }: { disabled: boolean }) {
  const attachments = usePromptInputAttachments();

  return (
    <PromptInputButton
      aria-label="Add attachment"
      disabled={disabled}
      onClick={() => attachments.openFileDialog()}
    >
      <ImageIcon className="size-4" />
    </PromptInputButton>
  );
}

function AttachmentsDisplay() {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <PromptInputAttachments className="flex flex-wrap gap-2 p-2 border-b">
      {(attachment) => (
        <div key={attachment.id} className="relative">
          {attachment.mediaType.startsWith('image/') && attachment.url ? (
            <img
              alt={attachment.filename ?? 'attachment'}
              className="size-20 rounded-md border object-cover"
              src={attachment.url}
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-md border bg-muted">
              <ImageIcon className="size-6 text-muted-foreground" />
            </div>
          )}
          <button
            aria-label="Remove attachment"
            className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
            onClick={() => attachments.remove(attachment.id)}
            type="button"
          >
            <span className="sr-only">Remove</span>×
          </button>
        </div>
      )}
    </PromptInputAttachments>
  );
}
