import React, { useState } from 'react';
import { SKILLS, SKILL_BRANCHES, SKILL_TYPES, SkillSystem } from '../utils/SkillSystem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Swords, Shield, Sparkles, Lock, CheckCircle2, Circle } from 'lucide-react';

const SkillTree = ({ player, learnedSkills, skillPoints, onLearnSkill, onUseSkill, skillCooldowns }) => {
  const [selectedBranch, setSelectedBranch] = useState(SKILL_BRANCHES.COMBAT);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const getBranchIcon = (branch) => {
    switch (branch) {
      case SKILL_BRANCHES.COMBAT:
        return <Swords className="w-4 h-4" />;
      case SKILL_BRANCHES.DEFENSE:
        return <Shield className="w-4 h-4" />;
      case SKILL_BRANCHES.MAGIC:
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBranchColor = (branch) => {
    switch (branch) {
      case SKILL_BRANCHES.COMBAT:
        return 'text-red-400 border-red-500';
      case SKILL_BRANCHES.DEFENSE:
        return 'text-blue-400 border-blue-500';
      case SKILL_BRANCHES.MAGIC:
        return 'text-purple-400 border-purple-500';
      default:
        return 'text-amber-400 border-amber-500';
    }
  };

  const canLearn = (skillId) => {
    const skill = SKILLS[skillId];
    const currentLevel = learnedSkills[skillId] || 0;
    const cost = SkillSystem.getSkillCost(skillId, currentLevel);
    
    return SkillSystem.canLearnSkill(skillId, learnedSkills) && skillPoints >= cost;
  };

  const isLocked = (skillId) => {
    return !SkillSystem.canLearnSkill(skillId, learnedSkills);
  };

  const getSkillLevel = (skillId) => {
    return learnedSkills[skillId] || 0;
  };

  const getCooldownRemaining = (skillId) => {
    return skillCooldowns[skillId] || 0;
  };

  const canUseSkill = (skillId) => {
    const level = getSkillLevel(skillId);
    const cooldown = getCooldownRemaining(skillId);
    return level > 0 && cooldown === 0;
  };

  const branchSkills = SkillSystem.getSkillsByBranch(selectedBranch);
  const activeSkills = branchSkills.filter(s => s.type === SKILL_TYPES.ACTIVE);
  const passiveSkills = branchSkills.filter(s => s.type === SKILL_TYPES.PASSIVE);

  return (
    <div className="skill-tree-container space-y-3">
      {/* Skill Points Display */}
      <div className="fantasy-panel-enhanced p-3">
        <div className="flex items-center justify-between">
          <span className="fantasy-text text-xs">Available Skill Points:</span>
          <span className="game-title text-amber-400 text-base">{skillPoints}</span>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="flex gap-2">
        {Object.values(SKILL_BRANCHES).map((branch) => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={`flex-1 pixel-btn fantasy-panel-enhanced p-2 flex items-center justify-center gap-2 transition-all ${
              selectedBranch === branch
                ? `${getBranchColor(branch)} shadow-lg scale-105`
                : 'text-gray-400 border-gray-600'
            }`}
          >
            {getBranchIcon(branch)}
            <span className="text-xs uppercase fantasy-text">
              {branch}
            </span>
          </button>
        ))}
      </div>

      {/* Active Skills Section */}
      <div className="fantasy-panel-enhanced p-3 space-y-2">
        <h3 className="game-title text-sm text-amber-400 mb-2">⚡ Active Skills</h3>
        <div className="space-y-2">
          {activeSkills.map((skill) => {
            const level = getSkillLevel(skill.id);
            const cost = SkillSystem.getSkillCost(skill.id, level);
            const locked = isLocked(skill.id);
            const maxed = level >= skill.maxLevel;
            const cooldown = getCooldownRemaining(skill.id);
            const canUse = canUseSkill(skill.id);

            return (
              <div
                key={skill.id}
                className={`fantasy-panel p-2 transition-all ${
                  locked ? 'opacity-50' : 'hover:border-amber-500'
                }`}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg">{skill.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="fantasy-text text-xs font-bold text-amber-200">
                          {skill.name}
                        </h4>
                        {locked && <Lock className="w-3 h-3 text-gray-500" />}
                        {maxed && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                      </div>
                      <p className="fantasy-text text-[10px] text-gray-400 mt-0.5">
                        {skill.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="fantasy-text text-[9px] text-gray-500">
                          Cooldown: {skill.cooldown} turns
                        </span>
                        {cooldown > 0 && (
                          <span className="fantasy-text text-[9px] text-orange-400">
                            Ready in: {cooldown}
                          </span>
                        )}
                      </div>
                      {skill.requirements && (
                        <div className="fantasy-text text-[9px] text-purple-400 mt-0.5">
                          Requires: {Object.keys(skill.requirements).map(req => SKILLS[req].name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full border ${
                            i < level
                              ? 'bg-amber-400 border-amber-500'
                              : 'bg-gray-700 border-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {!maxed && (
                        <button
                          onClick={() => onLearnSkill(skill.id)}
                          disabled={!canLearn(skill.id)}
                          className="pixel-btn text-[9px] px-2 py-0.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600"
                        >
                          Learn ({cost} SP)
                        </button>
                      )}
                      {level > 0 && (
                        <button
                          onClick={() => onUseSkill(skill.id)}
                          disabled={!canUse}
                          className={`pixel-btn text-[9px] px-2 py-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                            canUse ? 'bg-green-600 hover:bg-green-500' : ''
                          }`}
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Passive Skills Section */}
      <div className="fantasy-panel-enhanced p-3 space-y-2">
        <h3 className="game-title text-sm text-cyan-400 mb-2">🌟 Passive Skills</h3>
        <div className="space-y-2">
          {passiveSkills.map((skill) => {
            const level = getSkillLevel(skill.id);
            const cost = SkillSystem.getSkillCost(skill.id, level);
            const locked = isLocked(skill.id);
            const maxed = level >= skill.maxLevel;

            return (
              <div
                key={skill.id}
                className={`fantasy-panel p-2 transition-all ${
                  locked ? 'opacity-50' : 'hover:border-cyan-500'
                }`}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg">{skill.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="fantasy-text text-xs font-bold text-cyan-200">
                          {skill.name}
                        </h4>
                        {locked && <Lock className="w-3 h-3 text-gray-500" />}
                        {maxed && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                      </div>
                      <p className="fantasy-text text-[10px] text-gray-400 mt-0.5">
                        {skill.description}
                      </p>
                      {skill.requirements && (
                        <div className="fantasy-text text-[9px] text-purple-400 mt-0.5">
                          Requires: {Object.keys(skill.requirements).map(req => SKILLS[req].name).join(', ')}
                        </div>
                      )}
                      {level > 0 && (
                        <div className="fantasy-text text-[9px] text-green-400 mt-1">
                          ✓ Active
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full border ${
                            i < level
                              ? 'bg-cyan-400 border-cyan-500'
                              : 'bg-gray-700 border-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    {!maxed && (
                      <button
                        onClick={() => onLearnSkill(skill.id)}
                        disabled={!canLearn(skill.id)}
                        className="pixel-btn text-[9px] px-2 py-0.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600"
                      >
                        Learn ({cost} SP)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Details Tooltip */}
      {hoveredSkill && (
        <div className="fantasy-panel-enhanced p-3 space-y-2 border-amber-500">
          <h4 className="game-title text-sm text-amber-400">
            {hoveredSkill.icon} {hoveredSkill.name}
          </h4>
          <p className="fantasy-text text-xs text-gray-300">
            {hoveredSkill.description}
          </p>
          <div className="fantasy-text text-[10px] text-gray-400 space-y-1">
            <div>Type: {hoveredSkill.type === SKILL_TYPES.ACTIVE ? 'Active' : 'Passive'}</div>
            <div>Max Level: {hoveredSkill.maxLevel}</div>
            {hoveredSkill.cooldown && <div>Cooldown: {hoveredSkill.cooldown} turns</div>}
            {hoveredSkill.requirements && (
              <div>Requirements: {Object.entries(hoveredSkill.requirements).map(([id, lvl]) => `${SKILLS[id].name} Lv.${lvl}`).join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTree;

