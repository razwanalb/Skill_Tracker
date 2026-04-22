import React from 'react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Share2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from '../images/my_logo.png';

export function Analytics() {
  const { columns, dailyRecords, user } = useStore();

  // Aggregate stats per skill
  const skillStats = columns.map(col => {
    let completed = 0;
    let pending = 0;
    let missed = 0;

    Object.values(dailyRecords).forEach(record => {
      record.tasks.forEach(task => {
        const s = task.completions[col.id];
        if (s === 'completed') completed++;
        else if (s === 'pending') pending++;
        else if (s === 'missed') missed++;
      });
    });

    const total = completed + pending + missed;
    
    return {
      name: col.name,
      completed,
      pending,
      missed,
      total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  const handleShare = async () => {
    try {
      const topSkill = skillStats[0];
      const text = `I've reached a ${topSkill?.completionRate || 0}% completion rate in ${topSkill?.name || 'my skills'}! Track your own progress on Skill Tracker.`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Skill Progress',
          text,
          url: window.location.href,
        });
      } else {
        alert('Sharing is not supported on this browser context. You can copy the URL to share.');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDownload = async () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    // --- HEADER BANNER ---
    // Use pure white background to let the deep blue logo stand out prominently
    doc.setFillColor(255, 255, 255); 
    doc.rect(0, 0, 210, 45, 'F');
    
    // Draw a subtle dividing line to separate header from content
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 45, 196, 45);

    try {
      const img = new Image();
      img.src = logoImage;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      // Add logo image
      doc.addImage(img, 'PNG', 14, 9, 16, 16);
      
      doc.setTextColor(12, 36, 130); // Primary Dark Blue
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text('SKILL TRACKER', 34, 22);
    } catch {
      // Fallback
      doc.setTextColor(12, 36, 130);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text('SKILL TRACKER', 14, 22);
    }
    
    // Subtitle
    doc.setTextColor(100, 116, 139); // Slate muted color
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Performance & Routine Analytics Report', 14, 32);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Lighter muted color
    doc.text(`Generated: ${dateStr}`, 196, 22, { align: 'right' });
    if (user?.name) {
      doc.text(`For: ${user.name}`, 196, 28, { align: 'right' });
    }

    // --- QUICK INSIGHTS BOXES ---
    const topSkill = skillStats[0]?.name || 'None';
    const totalSkillsCount = skillStats.length;
    let totalCompleted = 0;
    skillStats.forEach(s => totalCompleted += s.completed);

    // Draw cards
    doc.setFillColor(244, 247, 249);
    doc.setDrawColor(224, 230, 237);
    doc.roundedRect(14, 55, 56, 25, 3, 3, 'FD'); // Box 1
    doc.roundedRect(77, 55, 56, 25, 3, 3, 'FD'); // Box 2
    doc.roundedRect(140, 55, 56, 25, 3, 3, 'FD'); // Box 3

    doc.setTextColor(127, 140, 141);
    doc.setFontSize(9);
    doc.text("TRACKED SKILLS", 42, 63, { align: 'center' });
    doc.text("TOP SKILL", 105, 63, { align: 'center' });
    doc.text("TOTAL COMPLETIONS", 168, 63, { align: 'center' });

    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`${totalSkillsCount}`, 42, 73, { align: 'center' });
    doc.text(`${topSkill}`, 105, 73, { align: 'center' });
    doc.text(`${totalCompleted}`, 168, 73, { align: 'center' });

    // --- VISUAL PROGRESS BARS ---
    let startY = 95;
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'bold');
    doc.text("Skill Proficiency Visualized", 14, startY);
    
    startY += 10;
    
    // Draw top 8 skills as visual bars to fit page nicely
    skillStats.slice(0, 8).forEach((skill) => {
      doc.setFontSize(10);
      doc.setTextColor(44, 62, 80);
      doc.setFont('helvetica', 'bold');
      
      // Truncate long names slightly if needed
      const displayName = skill.name.length > 15 ? skill.name.substring(0, 15) + '...' : skill.name;
      doc.text(displayName, 14, startY + 4);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`${skill.completionRate}%`, 196, startY + 4, { align: 'right' });

      // Background tracking bar
      doc.setFillColor(235, 240, 245);
      doc.roundedRect(55, startY, 125, 5, 2.5, 2.5, 'F');

      // Fill bar based on completion rate
      const fillWidth = (skill.completionRate / 100) * 125;
      if (fillWidth > 0) {
        if (skill.completionRate > 75) doc.setFillColor(76, 175, 80); // success green
        else if (skill.completionRate > 40) doc.setFillColor(255, 152, 0); // pending orange
        else doc.setFillColor(244, 67, 54); // error red
        
        doc.roundedRect(55, startY, fillWidth, 5, 2.5, 2.5, 'F');
      }
      startY += 12;
    });

    // --- DETAILED TABLE ---
    const tableData = skillStats.map(s => [
      s.name, 
      `${s.completionRate}%`, 
      s.completed.toString(), 
      s.pending.toString(), 
      s.missed.toString()
    ]);

    const tableStartY = startY + 5;
    autoTable(doc, {
      startY: tableStartY,
      head: [['Skill', 'Progress', 'Completed', 'Pending', 'Missed']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [12, 36, 130], 
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { 
        textColor: [44, 62, 80],
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' }
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 6, 
        font: 'helvetica' 
      },
      alternateRowStyles: { 
        fillColor: [248, 250, 252] 
      },
      margin: { top: 20, left: 14, right: 14, bottom: 20 },
      didDrawPage: (data) => {
        // Handle subsequent page headers
        if ((data as any).pageNumber > 1) {
          doc.setFillColor(12, 36, 130);
          doc.rect(0, 0, 210, 15, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('SKILL TRACKER', 14, 10);
        }

        // Custom Footer
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        
        // Page Number (Subtle)
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${(data as any).pageNumber}`, data.settings.margin.left, pageHeight - 10);
        
        // Developer Credit (Highly Prominent & Eye-Catching)
        doc.setFontSize(12);
        doc.setTextColor(12, 36, 130); // Bright Primary Indigo
        doc.setFont('helvetica', 'bold');
        doc.text('Skill Tracker // Developed by SR Ahammad', pageWidth - 14, pageHeight - 10, { align: 'right' });
      }
    });

    doc.save(`Routine-Analytics-${dateStr.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col min-h-0">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-[22px] font-bold text-ink mb-1">Analytics</h1>
          <p className="text-[14px] text-muted">Skill-wise performance & insights</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleShare} className="bg-card text-primary border border-line px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-surface transition">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={handleDownload} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-primary-dark transition">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        
        {/* Chart */}
        <div className="bg-card rounded-[12px] shadow-card border border-line p-6 flex flex-col">
          <h2 className="text-[16px] font-semibold text-ink mb-6">Completion Rate by Skill</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillStats} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis type="number" unit="%" axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="completionRate" radius={[0, 4, 4, 0]} barSize={24}>
                  {
                    skillStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.completionRate > 75 ? '#4caf50' : entry.completionRate > 40 ? '#ff9800' : '#f44336'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-card rounded-[12px] shadow-card border border-line p-6 flex flex-col">
          <h2 className="text-[16px] font-semibold text-ink mb-6">Skill Proficiency</h2>
          <div className="space-y-4">
            {skillStats.map(stat => (
              <div key={stat.name} className="flex flex-col gap-2">
                <div className="flex justify-between text-[13px]">
                  <span>{stat.name}</span>
                  <span>{stat.completionRate}%</span>
                </div>
                <div className="h-2 bg-[#eee] rounded w-full overflow-hidden">
                  <div className="h-full bg-primary rounded" style={{ width: `${stat.completionRate}%` }}></div>
                </div>
              </div>
            ))}
            {skillStats.length === 0 && (
              <p className="text-center text-muted py-10">No clear data generated yet. Keep tracking!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
