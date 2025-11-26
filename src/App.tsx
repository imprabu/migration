import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, Download, Upload, RotateCcw, FileJson } from 'lucide-react';

const MigrationQuestionnaireApp = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = [
    {
      name: "Story Creation & Open",
      color: "bg-purple-600",
      responsible: "PM & TechArch/TechLead",
      questions: [
        { id: "parent_id", label: "Parent ID (FR Ticket ID - Epic/Story only)", type: "text", required: true },
        { id: "related_story", label: "Related User Story Link", type: "text", required: true },
        { id: "end_date", label: "Realistic End Date", type: "date", required: true },
        { id: "cohorts_buckets", label: "Define Cohorts and Bucketings", type: "radio", options: ["Yes", "No"], required: true },
        { id: "tech_doc_link", label: "Detailed Plan Tech Doc Link", type: "text", required: true },
        { id: "assignee", label: "Assigned Developer", type: "text", required: true }
      ]
    },
    {
      name: "In Progress",
      color: "bg-blue-500",
      responsible: "Assigned Developer",
      questions: [
        { id: "downstream_systems", label: "Impacted Downstream Systems (e.g., analytics, marketplace)", type: "text", required: true },
        { id: "functional_area", label: "Core Functional Area (e.g., ITSM, ESM)", type: "text", required: true },
        { id: "is_pre_migration", label: "Is Pre Migration?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "validation_script", label: "Validation Script (Post-migration verification)", type: "textarea", required: true },
        { id: "staging_script_url", label: "Staging Script URL", type: "textarea", required: true },
        { id: "dry_run_script", label: "Dry Run Script", type: "textarea", required: false },
        { id: "rollback_script", label: "Rollback Script", type: "textarea", required: true },
        { id: "pause_stop_logic", label: "Pause/Stop Logic", type: "radio", options: ["Yes", "No"], required: true },
        { id: "central_topic_required", label: "New Central Topic Required?", type: "radio", options: ["Yes", "No"], required: true }
      ]
    },
    {
      name: "Tech Arch Review",
      color: "bg-pink-500",
      responsible: "Technical Architect",
      questions: [
        { id: "rollback_validated", label: "Rollback Script Validated?", type: "radio", options: ["Yes", "No", "Needs Revision"], required: true },
        { id: "validation_reviewed", label: "Validation Script Reviewed?", type: "radio", options: ["Approved", "Needs Changes"], required: true },
        { id: "dry_run_approved", label: "Dry Run Script Approved?", type: "radio", options: ["Approved", "Needs Changes"], required: false },
        { id: "dry_run_executed", label: "Dry Run Execution Verified?", type: "radio", options: ["Yes", "No"], required: false },
        { id: "stop_pause_validated", label: "Stop/Pause Logic Validated?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "pm_review_needed", label: "PM Review Required?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "sre_review_needed", label: "Is SRE Review Required?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "tech_arch_comments", label: "Technical Architecture Comments", type: "textarea", required: false }
      ]
    },
    {
      name: "PM Review",
      color: "bg-green-500",
      responsible: "Product Manager",
      skippable: true,
      skipCondition: { questionId: "pm_review_needed", value: "No" },
      questions: [
        { id: "downstream_verified", label: "Downstream Systems Verified?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "functional_area_validated", label: "Core Functional Area Validated?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "communication_plan", label: "GTM/Customer/Stakeholder Communication Plan", type: "textarea", required: true },
        { id: "validation_approach", label: "Validation Approaches Reviewed", type: "textarea", required: true },
        { id: "business_impact", label: "Business Impact Assessment", type: "textarea", required: true },
        { id: "pm_approval", label: "PM Approval Status", type: "radio", options: ["Approved", "Needs Revision"], required: true }
      ]
    },
    {
      name: "SRE Review",
      color: "bg-cyan-400",
      responsible: "SRE Team",
      skippable: true,
      skipCondition: { questionId: "sre_review_needed", value: "No" },
      questions: [
        { id: "all_scripts_ready", label: "All Scripts Ready and Verified?", type: "radio", options: ["Yes", "No", "NA"], required: true },
        { id: "monitoring_configured", label: "Monitoring Dashboards Configured?", type: "radio", options: ["Yes", "No", "NA"], required: true },
        { id: "alerting_setup", label: "Alerting Systems Setup?", type: "radio", options: ["Yes", "No", "NA"], required: true },
        { id: "risk_reviewed", label: "Risk Assessment Reviewed?", type: "radio", options: ["Yes", "No", "NA"], required: true },
        { id: "rollback_plans_reviewed", label: "Rollback Plans Reviewed?", type: "radio", options: ["Yes", "No", "NA"], required: true },
        { id: "sre_approval", label: "SRE Approval Status", type: "radio", options: ["Approved", "Needs Revision"], required: true }
      ]
    },
    {
      name: "Testing",
      color: "bg-orange-400",
      responsible: "QA Engineer",
      questions: [
        { id: "migration_scripts_tested", label: "All Migration Scripts Tested?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "rollback_procedures_validated", label: "Rollback Procedures Validated?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "dry_run_validation", label: "Dry Run Validation Executed?", type: "radio", options: ["Pass", "Fail"], required: false },
        { id: "stop_pause_tested", label: "Stop/Pause Functionality Tested?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "pre_migration_checks", label: "Pre-migration Checks Verified?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "post_migration_validated", label: "Post-migration Scripts Validated?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "test_results", label: "Test Results Documentation", type: "textarea", required: true },
        { id: "monitoring_confirmed", label: "Monitoring Setup Confirmed?", type: "radio", options: ["Yes", "No"], required: false }
      ]
    },
    {
      name: "In Execution - Staging",
      color: "bg-pink-400",
      responsible: "Developer or QA",
      questions: [
        { id: "staging_migration_status", label: "Staging Migration Execution Status", type: "radio", options: ["Completed", "In Progress", "Failed"], required: true },
        { id: "staging_performance", label: "Staging Performance Monitoring Results", type: "textarea", required: false },
        { id: "staging_validation_results", label: "Post-migration Validation in Staging", type: "textarea", required: true },
        { id: "verified_in_staging", label: "Verified in Staging?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "staging_issues", label: "Document Staging Issues/Deviations", type: "textarea", required: false },
        { id: "rollback_validated_staging", label: "Rollback Procedures Validated in Staging?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "production_script_urls", label: "Production Script URLs (US/INDIA/EU/MEA/ANZ)", type: "textarea", required: true }
      ]
    },
    {
      name: "In Execution - Prod",
      color: "bg-red-500",
      responsible: "Developer or QA",
      questions: [
        { id: "prod_migration_status", label: "Production Migration Execution Status", type: "radio", options: ["Completed", "In Progress", "Failed"], required: true },
        { id: "supreme_one_links", label: "Supreme One Links", type: "text", required: true },
        { id: "prod_validation_results", label: "Post-migration Validation in Production", type: "radio", options: ["Yes", "No", "NA"], required: true },
        { id: "verified_in_prod", label: "Verified in Prod - Specific Regions (e.g., US-East, EU-West, APAC)", type: "text", required: true },
        { id: "prod_issues", label: "Document Production Issues/Deviations", type: "textarea", required: false }
      ]
    },
    {
      name: "Closed",
      color: "bg-green-600",
      responsible: "Developer or PM",
      questions: [
        { id: "migration_confirmed", label: "Migration Completion Confirmed?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "systems_operational", label: "All Systems Operational?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "stakeholders_notified", label: "Stakeholders Notified?", type: "radio", options: ["Yes", "No"], required: true },
        { id: "pm_verification", label: "PM Verification Complete?", type: "radio", options: ["Yes", "No"], required: false },
        { id: "retrospective_conducted", label: "Retrospective Conducted?", type: "radio", options: ["Yes", "No", "NA"], required: true },
        { id: "lessons_learned", label: "Lessons Learned Documentation", type: "textarea", required: false }
      ]
    }
  ];

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const isStageSkipped = (stageIndex: number) => {
    const stage = stages[stageIndex];
    if (!stage.skippable) return false;
    
    const skipCondition = stage.skipCondition;
    const questionId = skipCondition.questionId;
    const value = skipCondition.value;
    return answers[questionId] === value;
  };

  const validateCurrentStage = () => {
    const currentStageData = stages[currentStage];
    const missingFields: string[] = [];

    currentStageData.questions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        if (!answer || answer.trim() === '') {
          missingFields.push(question.label);
        }
      }
    });

    return missingFields;
  };

  const handleNext = () => {
    const missingFields = validateCurrentStage();
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields before proceeding:\n\n${missingFields.map((field, index) => `${index + 1}. ${field}`).join('\n')}`);
      return;
    }

    if (currentStage < stages.length - 1) {
      let nextStage = currentStage + 1;
      
      // Skip stages if their skip condition is met
      while (nextStage < stages.length && isStageSkipped(nextStage)) {
        nextStage++;
      }
      
      setCurrentStage(nextStage);
    }
  };

  const handlePrevious = () => {
    if (currentStage > 0) {
      let prevStage = currentStage - 1;
      
      // Skip stages if their skip condition is met
      while (prevStage >= 0 && isStageSkipped(prevStage)) {
        prevStage--;
      }
      
      setCurrentStage(Math.max(0, prevStage));
    }
  };

  const handleSubmit = () => {
    const missingFields = validateCurrentStage();
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields before completing:\n\n${missingFields.map((field, index) => `${index + 1}. ${field}`).join('\n')}`);
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all answers? This action cannot be undone.')) {
      setAnswers({});
      setCurrentStage(0);
      setSubmitted(false);
      setShowStartPage(true);
    }
  };

  const exportData = () => {
    const exportPayload = {
      metadata: {
        exportDate: new Date().toISOString(),
        currentStage: currentStage,
        currentStageName: stages[currentStage].name,
        totalStages: stages.length,
        completionPercentage: Math.round(((currentStage + 1) / stages.length) * 100)
      },
      answers: answers
    };
    const dataStr = JSON.stringify(exportPayload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `migration-questionnaire-stage${currentStage + 1}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Check if it's new format with metadata or old format (just answers)
          if (importedData.metadata && importedData.answers) {
            setAnswers(importedData.answers);
            setCurrentStage(importedData.metadata.currentStage || 0);
            setShowStartPage(false);
            alert(`Data imported successfully!\n\nLast saved at: ${new Date(importedData.metadata.exportDate).toLocaleString()}\nStage: ${importedData.metadata.currentStageName}\nProgress: ${importedData.metadata.completionPercentage}%`);
          } else {
            // Old format - just answers object
            setAnswers(importedData);
            setShowStartPage(false);
            alert('Data imported successfully!');
          }
        } catch (error) {
          alert('Error importing file. Please make sure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startQuestionnaire = () => {
    setShowStartPage(false);
  };

  // Start Page
  if (showStartPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-3xl w-full">
          <div className="text-center mb-8">
            <FileJson className="w-20 h-20 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Migration Ticket Questionnaire</h1>
            <p className="text-gray-600 text-lg">FreshRelease Process Documentation System</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h3 className="font-semibold text-purple-800 mb-2">📋 What's This?</h3>
              <p className="text-sm text-gray-700">Complete questionnaire covering all 9 stages of the migration ticket workflow - from Story Creation to Closure.</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">✨ Features</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Navigate back to edit previous stages anytime</li>
                <li>• Export your responses as JSON</li>
                <li>• Import previously saved JSON files</li>
                <li>• Reset all answers when needed</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={startQuestionnaire}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg flex items-center justify-center gap-3"
            >
              <ChevronRight className="w-6 h-6" />
              Start New Questionnaire
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={triggerFileInput}
              className="w-full bg-white border-2 border-purple-300 text-purple-700 px-8 py-4 rounded-lg hover:bg-purple-50 transition-all font-semibold text-lg flex items-center justify-center gap-3"
            >
              <Upload className="w-6 h-6" />
              Import from JSON File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }

  // Submission/Results Page
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Questionnaire Complete!</h2>
              <p className="text-gray-600 mb-8">Review your responses below and download the JSON file.</p>
            </div>

            {/* JSON Preview */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileJson className="w-6 h-6" />
                Complete Response Data (JSON)
              </h3>
              
              {/* Metadata Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">📊 Export Metadata</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Export Date:</span>
                    <span className="ml-2 font-semibold">{new Date().toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Stage:</span>
                    <span className="ml-2 font-semibold">{stages[currentStage].name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Completion:</span>
                    <span className="ml-2 font-semibold">100%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="ml-2 font-semibold">{Object.keys(answers).length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-auto max-h-96 font-mono text-sm">
                <pre>{JSON.stringify({
                  metadata: {
                    exportDate: new Date().toISOString(),
                    currentStage: currentStage,
                    currentStageName: stages[currentStage].name,
                    totalStages: stages.length,
                    completionPercentage: 100
                  },
                  answers: answers
                }, null, 2)}</pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={exportData}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-semibold"
              >
                <Download className="w-5 h-5" />
                Download JSON
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Edit
              </button>
              <button
                onClick={handleReset}
                className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                Reset All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStageData = stages[currentStage];

  // Main Questionnaire Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Migration Ticket State Flow Questionnaire</h1>
            <p className="text-gray-600 text-sm">FreshRelease Process Documentation</p>
          </div>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 overflow-x-auto pb-2">
            {stages.map((stage, index) => {
              const isSkipped = isStageSkipped(index);
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center flex-shrink-0 min-w-[100px] cursor-pointer relative"
                  onClick={() => !isSkipped && setCurrentStage(index)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm transition-all ${
                    isSkipped 
                      ? 'bg-gray-300 line-through' 
                      : index === currentStage 
                        ? stage.color + ' scale-110' 
                        : index < currentStage 
                          ? 'bg-gray-400' 
                          : 'bg-gray-200'
                  }`}>
                    {isSkipped ? '⊘' : index < currentStage ? <Check className="w-6 h-6" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-2 text-center ${isSkipped ? 'text-gray-400 line-through' : index === currentStage ? 'font-bold' : ''}`}>
                    {stage.name}
                  </span>
                  {isSkipped && (
                    <span className="text-xs text-red-500 mt-1">Skipped</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isStageSkipped(currentStage) ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⊘</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Stage Skipped</h3>
              <p className="text-gray-500 mb-6">This stage is not applicable based on previous selections.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
          <div className="flex items-center justify-between mb-6">
            <div className={`inline-block px-6 py-3 rounded-lg text-white font-bold ${currentStageData.color}`}>
              Stage {currentStage + 1}: {currentStageData.name}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                👥 {currentStageData.responsible}
              </div>
              <button
                onClick={exportData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            </div>
          </div>

          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
            {currentStageData.questions.map((question, qIndex) => (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                <label className="block text-gray-700 font-semibold mb-3">
                  {qIndex + 1}. {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {question.type === 'text' && (
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  />
                )}

                {question.type === 'date' && (
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  />
                )}

                {question.type === 'textarea' && (
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                  ></textarea>
                )}

                {question.type === 'radio' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="w-4 h-4 text-purple-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStage === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStage === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStage === stages.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                <Check className="w-5 h-5" />
                Complete & Review
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
            </>
          )}
        </div>

        {/* Progress Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Stage {currentStage + 1} of {stages.length} • {Math.round(((currentStage + 1) / stages.length) * 100)}% Complete
        </div>
      </div>
    </div>
  );
};

export default MigrationQuestionnaireApp;
