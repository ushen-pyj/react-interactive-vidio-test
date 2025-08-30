'use client';

import React, { useState, useCallback, useRef } from 'react';
import { InteractiveVideoConfig, VideoSegment, BranchOption } from '../types/interactive-video';
import { buttonStylePresets } from '../utils/stylePresets';
import { availableConfigs } from '../data/sampleVideoConfig';
import NodeEditor from './NodeEditor';
import TreeVisualization from './TreeVisualization';
import StyleSelector from './StyleSelector';

interface VideoConfigEditorProps {
  initialConfig?: InteractiveVideoConfig;
  onSave?: (config: InteractiveVideoConfig) => void;
  onCancel?: () => void;
}

export default function VideoConfigEditor({ 
  initialConfig, 
  onSave, 
  onCancel 
}: VideoConfigEditorProps) {
  const [config, setConfig] = useState<InteractiveVideoConfig>(
    initialConfig || {
      id: 'new-config',
      title: '新的互动视频',
      description: '',
      startSegmentId: 'start',
      settings: {
        autoPlay: true,
        showControls: true,
        width: 1280,
        height: 720
      },
      segments: [{
        id: 'start',
        videoUrl: '',
        duration: 10,
        branches: []
      }]
    }
  );

  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('start');
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'form'>('tree');
  const [showImportModal, setShowImportModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [showQuickConfigModal, setShowQuickConfigModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取当前选中的片段
  const selectedSegment = config.segments.find(s => s.id === selectedSegmentId);

  // 更新配置的基本信息
  const updateBasicInfo = useCallback((updates: Partial<InteractiveVideoConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // 更新片段信息
  const updateSegment = useCallback((segmentId: string, updates: Partial<VideoSegment>) => {
    setConfig(prev => ({
      ...prev,
      segments: prev.segments.map(segment => 
        segment.id === segmentId ? { ...segment, ...updates } : segment
      )
    }));
  }, []);

  // 添加新片段
  const addSegment = useCallback((parentSegmentId?: string) => {
    const newSegmentId = `segment-${Date.now()}`;
    const newSegment: VideoSegment = {
      id: newSegmentId,
      videoUrl: '',
      duration: 10,
      branches: []
    };

    setConfig(prev => ({
      ...prev,
      segments: [...prev.segments, newSegment]
    }));

    // 如果有父片段，添加分支连接
    if (parentSegmentId) {
      const newBranch: BranchOption = {
        id: `branch-${Date.now()}`,
        label: '新分支',
        text: '新分支',
        nextSegmentId: newSegmentId,
        position: { x: 'center', y: 'bottom' },
        style: buttonStylePresets['circle-medium']
      };

      updateSegment(parentSegmentId, {
        branches: [...(config.segments.find(s => s.id === parentSegmentId)?.branches || []), newBranch]
      });
    }

    setSelectedSegmentId(newSegmentId);
  }, [config.segments, updateSegment]);

  // 删除片段
  const deleteSegment = useCallback((segmentId: string) => {
    if (segmentId === config.startSegmentId) {
      alert('不能删除起始片段');
      return;
    }

    setConfig(prev => ({
      ...prev,
      segments: prev.segments.filter(s => s.id !== segmentId)
    }));

    // 删除指向该片段的分支
    setConfig(prev => ({
      ...prev,
      segments: prev.segments.map(segment => ({
        ...segment,
        branches: segment.branches?.filter(branch => branch.nextSegmentId !== segmentId) || []
      }))
    }));

    if (selectedSegmentId === segmentId) {
      setSelectedSegmentId(config.startSegmentId);
    }
  }, [config.startSegmentId, selectedSegmentId]);

  // 添加分支
  const addBranch = useCallback((segmentId: string) => {
    const newBranch: BranchOption = {
      id: `branch-${Date.now()}`,
      label: '新分支',
      text: '新分支',
      nextSegmentId: '',
      position: { x: 'center', y: 'bottom' },
      style: buttonStylePresets['circle-medium']
    };

    updateSegment(segmentId, {
      branches: [...(config.segments.find(s => s.id === segmentId)?.branches || []), newBranch]
    });
  }, [config.segments, updateSegment]);

  // 更新分支
  const updateBranch = useCallback((segmentId: string, branchId: string, updates: Partial<BranchOption>) => {
    const segment = config.segments.find(s => s.id === segmentId);
    if (!segment) return;

    const updatedBranches = segment.branches?.map(branch => 
      branch.id === branchId ? { ...branch, ...updates } : branch
    ) || [];

    updateSegment(segmentId, { branches: updatedBranches });
  }, [config.segments, updateSegment]);

  // 删除分支
  const deleteBranch = useCallback((segmentId: string, branchId: string) => {
    const segment = config.segments.find(s => s.id === segmentId);
    if (!segment) return;

    const updatedBranches = segment.branches?.filter(branch => branch.id !== branchId) || [];
    updateSegment(segmentId, { branches: updatedBranches });
  }, [config.segments, updateSegment]);

  // 导出配置为JSON
  const exportConfig = useCallback(() => {
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [config]);

  // 导出配置为TS文件
  const exportConfigAsTS = useCallback(() => {
    // 深度复制配置对象，用于处理样式函数
    const processConfig = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(processConfig);
      } else if (obj && typeof obj === 'object') {
        const processed: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (key === 'style' && value && typeof value === 'object') {
            // 处理样式对象，尝试匹配预设样式
            const styleObj = value as any;
            if (styleObj.shape === 'circle' && styleObj.size === 'large') {
              processed[key] = 'createButtonStyle(\'circle-large\')';
            } else if (styleObj.shape === 'circle' && styleObj.size === 'medium') {
              processed[key] = 'createButtonStyle(\'circle-medium\')';
            } else if (styleObj.shape === 'circle' && styleObj.size === 'small') {
              processed[key] = 'createButtonStyle(\'circle-small\')';
            } else if (styleObj.shape === 'rectangle') {
              processed[key] = 'createButtonStyle(\'rectangle\')';
            } else if (styleObj.backgroundColor === 'transparent') {
              processed[key] = 'createButtonStyle(\'transparent\')';
            } else if (styleObj.fontSize && styleObj.fontSize >= 24) {
              processed[key] = 'createTitleStyle(\'default\')';
            } else {
              processed[key] = processConfig(value);
            }
          } else {
            processed[key] = processConfig(value);
          }
        }
        return processed;
      }
      return obj;
    };

    const processedConfig = processConfig(config);
    let configString = JSON.stringify(processedConfig, null, 2);
    
    // 替换样式函数调用的引号
    configString = configString.replace(/"(createButtonStyle\([^)]+\))"/g, '$1');
    configString = configString.replace(/"(createTitleStyle\([^)]+\))"/g, '$1');
    
    const tsContent = `import { InteractiveVideoConfig } from '../types/interactive-video';
import { createTitleStyle, createButtonStyle } from '../utils/stylePresets';

export const ${config.id}Config: InteractiveVideoConfig = ${configString};

export default ${config.id}Config;`;
    
    const blob = new Blob([tsContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.id}Config.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [config]);

  // 加载快捷配置
  const loadQuickConfig = useCallback((configKey: string) => {
    const selectedConfig = availableConfigs[configKey as keyof typeof availableConfigs];
    if (selectedConfig) {
      setConfig(selectedConfig);
      setSelectedSegmentId(selectedConfig.startSegmentId);
      setShowQuickConfigModal(false);
      alert(`已加载配置：${selectedConfig.title}`);
    }
  }, []);

  // 打开快捷配置模态框
  const openQuickConfigModal = useCallback(() => {
    setShowQuickConfigModal(true);
  }, []);

  // 关闭快捷配置模态框
  const closeQuickConfigModal = useCallback(() => {
    setShowQuickConfigModal(false);
  }, []);

  // 从文件导入配置
  const importConfigFromFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        const importedConfig = JSON.parse(fileContent);
        
        setConfig(importedConfig);
        setSelectedSegmentId(importedConfig.startSegmentId);
        setShowImportModal(false);
        alert('配置导入成功！');
      } catch (error) {
        alert(`配置文件格式错误：${error instanceof Error ? error.message : '请检查JSON文件格式'}`);
      }
    };
    reader.readAsText(file);
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);



  // 从JSON文本导入配置
  const importConfigFromJson = useCallback(() => {
    if (!jsonInput.trim()) {
      alert('请输入JSON配置数据');
      return;
    }

    try {
      let importedConfig = JSON.parse(jsonInput);
      
      setConfig(importedConfig);
      setSelectedSegmentId(importedConfig.startSegmentId);
      setShowImportModal(false);
      setJsonInput('');
      alert('配置导入成功！');
    } catch (error) {
      alert(`配置格式错误：${error instanceof Error ? error.message : '请检查输入的数据格式'}`);
    }
  }, [jsonInput]);

  // 打开导入模态框
  const openImportModal = useCallback(() => {
    setShowImportModal(true);
    setJsonInput('');
  }, []);

  // 关闭导入模态框
  const closeImportModal = useCallback(() => {
    setShowImportModal(false);
    setJsonInput('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 头部工具栏 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">互动视频配置编辑器</h1>
            <div className="flex items-center space-x-4">
              {/* 视图切换 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'tree' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  树状视图
                </button>
                <button
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'form' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  表单视图
                </button>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={openQuickConfigModal}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  快捷配置
                </button>
                <button
                  onClick={openImportModal}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  导入配置
                </button>
                <div className="relative group">
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    导出配置 ▼
                  </button>
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <button
                      onClick={exportConfig}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg"
                    >
                      导出为 JSON
                    </button>
                    <button
                      onClick={exportConfigAsTS}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-b-lg"
                    >
                      导出为 TS 文件
                    </button>
                  </div>
                </div>
                {onSave && (
                  <button
                    onClick={() => onSave(config)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    保存
                  </button>
                )}
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    取消
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 基本信息编辑 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">配置ID</label>
              <input
                type="text"
                value={config.id}
                onChange={(e) => updateBasicInfo({ id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateBasicInfo({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">起始片段ID</label>
              <select
                value={config.startSegmentId}
                onChange={(e) => updateBasicInfo({ startSegmentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {config.segments.map(segment => (
                  <option key={segment.id} value={segment.id}>{segment.id}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：树状视图或表单视图 */}
          <div className="lg:col-span-2">
            {viewMode === 'tree' ? (
              <TreeVisualization
                segments={config.segments}
                selectedSegmentId={selectedSegmentId}
                onSelectSegment={setSelectedSegmentId}
                onAddSegment={addSegment}
                onDeleteSegment={deleteSegment}
                onUpdateSegmentPosition={(segmentId, x, y) => {
                  // 可以在这里实现位置更新逻辑
                  console.log('Update segment position:', segmentId, x, y);
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">片段列表</h2>
                <div className="space-y-4">
                  {config.segments.map(segment => (
                    <div
                      key={segment.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSegmentId === segment.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSegmentId(segment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{segment.id}</h3>
                          <p className="text-sm text-gray-600">
                            时长: {segment.duration}s | 分支: {segment.branches?.length || 0}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addSegment(segment.id);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="添加子节点"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          {segment.id !== config.startSegmentId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSegment(segment.id);
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="删除节点"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSegment()}
                  className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + 添加新片段
                </button>
              </div>
            )}
          </div>

          {/* 右侧：节点编辑器 */}
          <div className="lg:col-span-1">
            {selectedSegment && (
              <NodeEditor
                segment={selectedSegment}
                onUpdateSegment={(updates) => updateSegment(selectedSegment.id, updates)}
                onAddBranch={() => addBranch(selectedSegment.id)}
                onUpdateBranch={(branchId, updates) => updateBranch(selectedSegment.id, branchId, updates)}
                onDeleteBranch={(branchId) => deleteBranch(selectedSegment.id, branchId)}
                availableSegments={config.segments}
              />
            )}
          </div>
        </div>
      </div>

      {/* 导入配置模态框 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">导入配置</h2>
                <button
                  onClick={closeImportModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* 方式一：文件导入 */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">方式一：从文件导入</h3>
                  <p className="text-sm text-gray-600 mb-4">选择一个JSON配置文件进行导入</p>
                  <div className="flex items-center space-x-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={importConfigFromFile}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      选择文件
                    </button>
                    <span className="text-sm text-gray-500">支持 .json 格式</span>
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">或</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* 方式二：配置数据输入 */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">方式二：直接输入配置数据</h3>
                  <p className="text-sm text-gray-600 mb-2">支持以下格式：</p>
                  <ul className="text-sm text-gray-600 mb-4 ml-4 list-disc">
                    <li>标准JSON格式</li>
                    <li>TypeScript配置对象格式（如 export const config = &#123;...&#125;）</li>
                    <li>JavaScript对象格式</li>
                  </ul>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder=""
                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">
                      {jsonInput.length} 个字符
                    </span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setJsonInput('')}
                        className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        清空
                      </button>
                      <button
                        onClick={importConfigFromJson}
                        disabled={!jsonInput.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        导入配置
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={closeImportModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 快捷配置选择模态框 */}
      {showQuickConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">选择快捷配置</h2>
                <button
                  onClick={closeQuickConfigModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {Object.entries(availableConfigs).map(([key, config]) => (
                  <div
                    key={key}
                    className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => loadQuickConfig(key)}
                  >
                    <h3 className="font-medium text-gray-800 mb-1">{config.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>配置ID: {config.id}</span>
                      <span>片段数: {config.segments.length}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeQuickConfigModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}