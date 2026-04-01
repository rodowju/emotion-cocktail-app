'use client';
import { useState } from 'react';
export default function Home() {
  const [diary, setDiary] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [emotions, setEmotions] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [comfort, setComfort] = useState('');
  const [activeTab, setActiveTab] = useState('music');
  const [activeScreen, setActiveScreen] = useState('home');
  const EC = ['#C084FC','#F472B6','#60A5FA','#FBB040','#34D399','#FB923C'];
  async function analyze() {
    if (!diary.trim()) return;
    setLoading(true); setStage(1); setEmotions(null); setAnalysis(null); setComfort('');
    try {
      const res = await fetch('/api/analyze', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ diary }) });
      const data = await res.json();
      setEmotions(data.emotions); setStage(2);
      setAnalysis(data.analysis); setStage(3);
      setComfort(data.comfort); setStage(4);
    } catch(e) { console.error(e); }
    setLoading(false);
  }
  return (
    <div style={{background:'#08080E',minHeight:'100vh',color:'#F0EBFF',fontFamily:'sans-serif',maxWidth:480,margin:'0 auto'}}>
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(8,8,14,.92)',borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',alignItems:'center',padding:'0 16px',height:56}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:17,fontWeight:700,flex:1,background:'linear-gradient(120deg,#C084FC,#F472B6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>🍸 감정 칵테일 다이어리</div>
        <div style={{display:'flex',gap:2,background:'#1E1E28',border:'1px solid rgba(255,255,255,.06)',borderRadius:12,padding:3}}>
          {([['home','✏️','일기'],['stats','📊','통계'],['med','🧘','명상']] as const).map(([id,ico,label])=>(
            <button key={id} onClick={()=>setActiveScreen(id)} style={{background:activeScreen===id?'rgba(192,132,252,.15)':'none',border:'none',color:activeScreen===id?'#C084FC':'#7E7A96',fontFamily:'sans-serif',fontSize:10,padding:'5px 10px',borderRadius:9,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:2,minWidth:52}}>
              <span style={{fontSize:15}}>{ico}</span>{label}
            </button>
          ))}
        </div>
      </nav>
      <div style={{padding:'18px 16px 90px'}}>
        {activeScreen==='home' && (
          <>
            {!loading && !analysis && (
              <>
                <div style={{textAlign:'center',padding:'28px 0 20px'}}>
                  <div style={{fontSize:56,marginBottom:12,filter:'drop-shadow(0 0 22px rgba(192,132,252,.65))'}}>🍸</div>
                  <h1 style={{fontFamily:'Georgia,serif',fontSize:28,fontWeight:700,lineHeight:1.2,marginBottom:8}}>오늘의 감정을<br/><em style={{color:'#C084FC'}}>칵테일</em>로</h1>
                  <p style={{color:'#7E7A96',fontSize:12,lineHeight:1.75}}>오늘 있었던 일, 감정, 생각을 자유롭게 털어놓으면 AI가 분석해드려요</p>
                </div>
                <div style={{background:'#10101A',border:'1px solid rgba(255,255,255,.055)',borderRadius:20,padding:16,marginBottom:12}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#C084FC',marginBottom:12}}>오늘의 일기</div>
                  <textarea value={diary} onChange={e=>setDiary(e.target.value)} placeholder="오늘 어땠나요? 자유롭게 써주세요." rows={5} style={{width:'100%',background:'#1E1E28',border:'1px solid rgba(255,255,255,.055)',borderRadius:12,color:'#F0EBFF',fontFamily:'sans-serif',fontSize:14,lineHeight:1.8,padding:'13px 14px',resize:'none',outline:'none',boxSizing:'border-box'}} />
                </div>
                <button onClick={analyze} disabled={!diary.trim()} style={{width:'100%',height:54,background:'linear-gradient(135deg,#9333EA,#DB2777)',border:'none',borderRadius:16,color:'#fff',fontFamily:'sans-serif',fontSize:15,fontWeight:700,cursor:'pointer',opacity:diary.trim()?1:.4}}>
                  🔮 감정 분석 &amp; 칵테일 제조
                </button>
              </>
            )}
            {loading && (
              <div style={{display:'flex',flexDirection:'column',gap:9,marginTop:20}}>
                {([['⚡','Haiku','감정 분류',1],['🧠','Sonnet','심리 분석 · 설계',2],['✨','Opus','위로 문장',3]] as const).map(([ico,name,role,s])=>(
                  <div key={s} style={{background:'#10101A',border:`1px solid ${stage>s?'rgba(52,211,153,.3)':stage===s?'rgba(192,132,252,.4)':'rgba(255,255,255,.055)'}`,borderRadius:16,padding:13}}>
                    <div style={{display:'flex',alignItems:'center',gap:9}}>
                      <div style={{width:32,height:32,borderRadius:9,background:'rgba(192,132,252,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>{ico}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>{name}</div><div style={{fontSize:10,color:'#7E7A96'}}>{role}</div></div>
                      <div style={{fontSize:10,padding:'3px 10px',borderRadius:20,fontWeight:600,background:stage>s?'rgba(52,211,153,.12)':stage===s?'rgba(251,176,64,.15)':'rgba(255,255,255,.05)',color:stage>s?'#34D399':stage===s?'#FBB040':'#7E7A96'}}>{stage>s?'완료 ✓':stage===s?'처리중':'대기중'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {analysis && (
              <div>
                <div style={{background:'#10101A',border:'1px solid rgba(255,255,255,.055)',borderRadius:24,overflow:'hidden',marginBottom:12}}>
                  <div style={{height:6,background:'linear-gradient(90deg,#7C3AED,#DB2777,#F59E0B)'}}></div>
                  <div style={{padding:'22px 20px 20px'}}>
                    <div style={{fontSize:60,textAlign:'center',marginBottom:12}}>{analysis.emoji}</div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:25,fontWeight:700,textAlign:'center',background:'linear-gradient(135deg,#D8B4FE,#F9A8D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:4}}>{analysis.cocktail}</div>
                    <div style={{textAlign:'center',color:'#7E7A96',fontSize:11,letterSpacing:2,marginBottom:20}}>{analysis.tagline}</div>
                    <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:20}}>
                      {emotions?.emotions?.slice(0,4).map((em: any,i: number)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{width:46,fontSize:11,color:'#7E7A96',textAlign:'right'}}>{em.name}</div>
                          <div style={{flex:1,height:5,background:'#1E1E28',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',borderRadius:3,width:`${em.percent}%`,background:EC[i%6]}}></div></div>
                          <div style={{fontSize:10,color:'#7E7A96',width:28,textAlign:'right'}}>{em.percent}%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontFamily:'Georgia,serif',fontSize:15,fontStyle:'italic',lineHeight:2,borderLeft:'2px solid #C084FC',paddingLeft:15,marginBottom:22}}>{comfort}</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:16}}>
                      <div style={{background:'#16161F',border:'1px solid rgba(255,255,255,.055)',borderRadius:12,padding:12}}><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'#7E7A96',marginBottom:5}}>🎨 오늘의 색</div><div style={{fontSize:12,fontWeight:600,display:'flex',alignItems:'center',gap:6}}><div style={{width:14,height:14,borderRadius:3,background:analysis.colorHex}}></div>{analysis.color}</div></div>
                      <div style={{background:'#16161F',border:'1px solid rgba(255,255,255,.055)',borderRadius:12,padding:12}}><div style={{fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'#7E7A96',marginBottom:5}}>🌙 처방</div><div style={{fontSize:12,fontWeight:600}}>{analysis.prescription}</div></div>
                    </div>
                    <div style={{display:'flex',gap:5,marginBottom:14,background:'#1E1E28',border:'1px solid rgba(255,255,255,.055)',borderRadius:12,padding:3}}>
                      {([['music','🎵','음악'],['food','🍽️','음식'],['quote','📖','좋은 글']] as const).map(([id,ico,label])=>(
                        <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,background:activeTab===id?'rgba(192,132,252,.15)':'none',border:'none',color:activeTab===id?'#C084FC':'#7E7A96',fontFamily:'sans-serif',fontSize:11,padding:'8px 4px',borderRadius:9,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                          <span style={{fontSize:17}}>{ico}</span>{label}
                        </button>
                      ))}
                    </div>
                    {activeTab==='music' && analysis.music?.map((m: any,i: number)=>(
                      <div key={i} style={{background:'#16161F',border:'1px solid rgba(255,255,255,.055)',borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:11,marginBottom:7}}>
                        <div style={{width:42,height:42,borderRadius:10,background:m.clr||'rgba(192,132,252,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{m.cover}</div>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,marginBottom:2}}>{m.name}</div><div style={{fontSize:11,color:'#7E7A96'}}>{m.mood}</div></div>
                        <div style={{fontSize:10,padding:'3px 9px',borderRadius:10,fontWeight:600,background:m.clr,color:m.tc}}>{m.tag}</div>
                      </div>
                    ))}
                    {activeTab==='food' && <>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:12}}>
                        {analysis.foods?.slice(0,4).map((f: any,i: number)=>(
                          <div key={i} style={{background:'#16161F',border:'1px solid rgba(255,255,255,.055)',borderRadius:16,padding:13}}>
                            <span style={{fontSize:28,marginBottom:7,display:'block'}}>{f.e}</span>
                            <div style={{fontSize:13,fontWeight:500,marginBottom:3}}>{f.n}</div>
                            <div style={{fontSize:11,color:'#7E7A96',lineHeight:1.5}}>{f.r}</div>
                            <div style={{fontSize:9,padding:'2px 8px',borderRadius:8,display:'inline-block',marginTop:6,fontWeight:700,background:f.bc,color:f.tc}}>{f.tag}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{background:'rgba(251,176,64,.07)',border:'1px solid rgba(251,176,64,.2)',borderRadius:16,padding:16}}>
                        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:13}}>
                          <span style={{fontSize:28}}>{analysis.recipe?.e}</span>
                          <div><div style={{fontFamily:'Georgia,serif',fontSize:18,fontWeight:700,color:'#FBB040'}}>{analysis.recipe?.name}</div><div style={{fontSize:11,color:'#7E7A96'}}>{analysis.recipe?.sub}</div></div>
                        </div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:12}}>{analysis.recipe?.ing?.map((ing: string,i: number)=><div key={i} style={{background:'rgba(251,176,64,.1)',border:'1px solid rgba(251,176,64,.2)',fontSize:11,color:'#FBB040',padding:'4px 10px',borderRadius:20}}>{ing}</div>)}</div>
                        {analysis.recipe?.steps?.map((step: string,i: number)=>(
                          <div key={i} style={{display:'flex',gap:9,alignItems:'flex-start',marginBottom:8}}>
                            <div style={{width:22,height:22,borderRadius:'50%',background:'rgba(251,176,64,.15)',color:'#FBB040',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
                            <div style={{fontSize:12,color:'#7E7A96',lineHeight:1.7}}>{step}</div>
                          </div>
                        ))}
                      </div>
                    </>}
                    {activeTab==='quote' && analysis.quotes?.map((q: any,i: number)=>(
                      <div key={i} style={{background:'#16161F',border:'1px solid rgba(255,255,255,.055)',borderRadius:16,padding:18,marginBottom:8}}>
                        <div style={{fontSize:9,padding:'2px 9px',borderRadius:8,display:'inline-block',marginBottom:11,fontWeight:700,background:q.bc,color:q.tc}}>{q.tag}</div>
                        <div style={{fontFamily:'Georgia,serif',fontSize:15,fontStyle:'italic',lineHeight:1.9,marginBottom:10}}>{q.text}</div>
                        <div style={{fontSize:11,color:'#7E7A96',textAlign:'right'}}>— {q.author}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:'rgba(96,165,250,.06)',border:'1px solid rgba(96,165,250,.2)',borderRadius:16,padding:15,marginBottom:12}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:'#60A5FA',marginBottom:9}}>🧠 AI INSIGHT</div>
                  <div style={{fontSize:12,color:'#7E7A96',lineHeight:1.8}}>{analysis.insight}</div>
                </div>
                <button onClick={()=>{setAnalysis(null);setEmotions(null);setComfort('');setDiary('');setStage(0);}} style={{width:'100%',background:'transparent',border:'1px solid rgba(255,255,255,.11)',color:'#7E7A96',fontFamily:'sans-serif',fontSize:13,padding:13,borderRadius:12,cursor:'pointer'}}>← 새로운 감정 기록하기</button>
              </div>
            )}
          </>
        )}
        {activeScreen==='stats' && <div style={{textAlign:'center',padding:'60px 0'}}><div style={{fontSize:48,marginBottom:16}}>📊</div><div style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:700}}>감정 리포트</div><div style={{color:'#7E7A96',fontSize:13,marginTop:8}}>일기를 기록하면 통계가 쌓여요</div></div>}
        {activeScreen==='med' && <div style={{textAlign:'center',padding:'60px 0'}}><div style={{fontSize:48,marginBottom:16}}>🧘</div><div style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:700}}>명상 & 케어</div><div style={{color:'#7E7A96',fontSize:13,marginTop:8}}>일기 분석 후 맞춤 명상을 추천해드려요</div></div>}
      </div>
    </div>
  );
}
