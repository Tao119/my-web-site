'use client'
import React, { useState } from 'react';

const CodeExecution = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const executeCode = async () => {
    try {
      console.log(code)
      const response = await fetch('/api/executeCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      console.log(response)

      if (response.ok) {
        const result = await response.json();
        console.log(result)
        setOutput(result.result);
      } else {
        const error = await response.json();
        setOutput(`エラー: ${error.error}`);
      }
    } catch (error) {
      // setOutput(`エラー: ${error.message}`);
    }
  };

  return (
    <div style={{display:"flex", flexDirection:"row"}}>
      <div style={{width: "500px", height:"500px"}}>
        <textarea style={{width: "400px", height:"500px", border:"1px solid black"}} value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
      <div style={{display:"flex", flexDirection:"column"}}>
      <div style={{marginBottom:"100px"}}>
        <button onClick={executeCode}>実行</button>
      </div>
      <div>
        <h3>実行結果:</h3>
        <pre>{output}</pre>
      </div>
      </div>
    </div>
  );
};

export default CodeExecution;
