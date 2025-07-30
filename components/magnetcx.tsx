'use client';
import React, { useEffect, useMemo, useState } from 'react';
import PipelineTable from './pipeline-table';
import CButton from '@/components/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Save, X } from 'lucide-react';
import useCreatePipelineApi from '@/hooks/api/pipeline/useCreatePipelineApi';
import { Input } from '@/components/ui/input';
import { PipelineStage } from '@/services/pipeline/iPipeline-service';
import { toast } from 'sonner';
import useGetAllPipelineApi from '@/hooks/api/pipeline/useGetAllPipelineApi';
import useGetPipelineByIdApi from '@/hooks/api/pipeline/useGetPipelineByIdApi';

interface PipelineResponse {
  data: {
    id: number;
    name: string;
    stages: PipelineStage[];
  };
}

const initialStages = [
  { name: 'Appointment Scheduled', probability: 10, usedIn: 1 },
  { name: 'Qualified To Buy', probability: 20, usedIn: 0 },
  { name: 'Presentation Scheduled', probability: 50, usedIn: 35 },
  { name: 'Decision Maker Bought-In', probability: 60, usedIn: 64 },
  { name: 'Contract Sent', probability: 70, usedIn: 42 },
  { name: 'Closed Won', probability: 100, usedIn: 15 },
  { name: 'Closed Lost', probability: 0, usedIn: 6 },
  { name: 'Closed Lost', probability: 0, usedIn: 6 },
  { name: 'Closed Lost', probability: 0, usedIn: 6 },
  { name: 'Closed Lost', probability: 0, usedIn: 6 },
];

const PipelineTableContainer = () => {
  const [isNew, setIsNew] = useState(false);
  const [pipelineName, setPipelineName] = useState('');
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [pipelineStages, setPipelineStages] = useState(initialStages);
  const [newPipelineStages, setNewPipelineStages] = useState([{ name: '', probability: 0 }]);

  const { data: GetAllpipelines } = useGetAllPipelineApi();
  const { data: pipelineData } = useGetPipelineByIdApi(selectedPipeline);
  const { mutateAsync } = useCreatePipelineApi();

  // Use IS_MOCK to determine data source
  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  // Mock pipeline structure to match real API
  const mockPipelines = [{ id: 'mock', name: 'Mock Pipeline', stages: initialStages }];

  // Use mock or real pipelines for dropdown options
  const newpipelineOptions = useMemo(() => {
    const pipelines = isMock ? mockPipelines : (GetAllpipelines?.data ?? []);
    return pipelines.map((pipeline: { id: string | number; name: string }) => ({
      label: pipeline.name,
      value: pipeline.id,
    }));
  }, [isMock, GetAllpipelines]);

  const selectedPipelineLabel =
    newpipelineOptions.find((opt: { label: string; value: string | number }) => opt.value === selectedPipeline)
      ?.label || 'Select Pipeline';

  useEffect(() => {
    // Set default selected pipeline when options load
    if (newpipelineOptions.length > 0 && !selectedPipeline) {
      setSelectedPipeline(newpipelineOptions[0].value);
    }
    // Update pipeline stages when pipelineData changes and not in "new" mode
    if (!isMock && pipelineData && !isNew) {
      setPipelineStages((pipelineData as any)?.data?.stages ?? []);
    }
    // For mock, always use initialStages
    if (isMock && !isNew) {
      setPipelineStages(initialStages);
    }
  }, [newpipelineOptions, selectedPipeline, pipelineData, isNew, isMock]);

  const onSubmit = async () => {
    try {
      if (newPipelineStages.find((e) => !e.name)) {
        toast.warning('Every stage should have some name');
        return;
      }
      if (!pipelineName) {
        toast.warning('Please enter Pipeline name');
        return;
      }
      const pipeline_stages: Array<PipelineStage> = newPipelineStages.map((e, index) => ({
        name: e.name,
        probability: e.probability,
        sequenceNo: index + 1,
      }));

      mutateAsync({ name: pipelineName, stages: pipeline_stages });
    } catch (err) {
      console.error(err);
    }
  };

  // Handler for adding a new stage at the top
  const handleAddStage = () => {
    const newStage = {
      name: '',
      probability: 0,
      usedIn: 0,
    };
    setPipelineStages((prevStages) => [newStage, ...prevStages]);
    if (isNew) {
      const newStage = {
        name: '',
        probability: 0,
      };
      setNewPipelineStages((prevStages) => [...prevStages, newStage]);
    }
  };

  const handleNewPipeline = () => {
    setIsNew(true);
  };

  // Handlers for editing and deleting stages
  const handleNameChange = (idx: number, value: string) => {
    setPipelineStages((stages) => stages.map((stage, i) => (i === idx ? { ...stage, name: value } : stage)));
    if (isNew)
      setNewPipelineStages((stages) => stages.map((stage, i) => (i === idx ? { ...stage, name: value } : stage)));
  };

  const handleProbabilityChange = (idx: number, value: number) => {
    setPipelineStages((stages) =>
      stages.map((stage, i) => (i === idx ? { ...stage, probability: Number(value) } : stage)),
    );
    if (isNew)
      setNewPipelineStages((stages) =>
        stages.map((stage, i) => (i === idx ? { ...stage, probability: Number(value) } : stage)),
      );
  };

  const handleDelete = (idx: number) => {
    setPipelineStages((stages) => stages.filter((_, i) => i !== idx));
    if (isNew) setNewPipelineStages((stages) => stages.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full mx-auto p-6 pt-6 pb-2 bg-white rounded shadow-xs border-none">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="font-medium text-lg text-gray-700 text-nowrap">
            {isNew ? 'Create' : 'Select'} a Pipeline
          </span>

          {isNew ? (
            <Input
              className="pr-10 rounded-lg h-[52px] bg-primary-light border-primary border !text-base"
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="Your Pipeline Name"
              value={pipelineName}
              required
            />
          ) : (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CButton
                    variant="outline"
                    className="px-4 py-2 bg-[#eaf6fa] text-primary outline-none font-medium border-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                    rightIcon={<ChevronDown className="w-4 h-4" />}
                  >
                    {selectedPipelineLabel}
                  </CButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {newpipelineOptions.map((opt: { label: string; value: string | number }) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setSelectedPipeline(opt.value)}
                      className={selectedPipeline === opt.value ? 'bg-primary/10 text-primary' : ''}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CButton
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleNewPipeline}
            className="px-5 py-2 bg-primary text-white rounded-lg font-semibold shadow"
          >
            Create Pipeline
          </CButton>
          {isNew && (
            <CButton
              title="Exit"
              leftIcon={<X className="size-6" />}
              variant={'secondary'}
              onClick={() => setIsNew(false)}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <PipelineTable
        stages={isNew ? newPipelineStages : pipelineStages}
        onNameChange={handleNameChange}
        onProbabilityChange={handleProbabilityChange}
        onDelete={handleDelete}
        isCreating={isNew}
      />

      {/* Add Stage Button */}
      <div className="mt-3 flex justify-between">
        <CButton
          variant="ghost"
          onClick={handleAddStage}
          className="text-primary font-medium px-2 py-1 rounded hover:bg-white hover:text-primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Stage
        </CButton>
        {isNew && (
          <CButton leftIcon={<Save className="w-4 h-4" />} onClick={onSubmit}>
            Save Pipeline
          </CButton>
        )}
      </div>
    </div>
  );
};

export default PipelineTableContainer;
