import React, {useState, useEffect} from 'react';
import qs from 'qs';

import * as S from './styles';
import logo from '../../images/logo.svg';

export default function Home() {
    
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [generatedMeme, setGeneratedMeme] = useState(null);

    useEffect(() => {
        (async () => {
            const response = await fetch('https://api.imgflip.com/get_memes');
            const { data: { memes } } = await response.json();
            setTemplates(memes);
        })();
    }, []);

    const handleInputChange = (index) => (e) => {
        const newValues = boxes;
        newValues[index] = e.target.value;
        setBoxes(newValues);
    };

    function handleSelectTemplate(template) {
        setSelectedTemplate(template);
        setBoxes([]);
    }

    async function handleSubmit(e) {
        e.preventDefault();

       const params = qs.stringify({
            template_id: selectedTemplate.id,
            username: 'wschenkel',
            password: 'willian0012',
            boxes: boxes.map(text => ({ text }))
       })

       const response = await fetch(`https://api.imgflip.com/caption_image?${params}`);
       const { data: { url } } = await response.json();

       setGeneratedMeme(url);
    }
    
    function handleReset() {
        setSelectedTemplate(null);
        setBoxes([]);
        setGeneratedMeme(null);
    }

    return (
        <S.Wrapper>
            <img src={logo} alt="Mememaker"/>

            <S.Card>
                {generatedMeme && (
                    <>
                        <img src={generatedMeme} alt="Generated Meme"/>
                        <S.Button onClick={handleReset} type="button">Criar outro meme</S.Button>
                    </>
                )}
                {!generatedMeme && (
                    <>
                        <h2>Selecione o template</h2>
                        <S.Template>
                            {templates.map((template) => (
                                <button 
                                    key={template.id} 
                                    type="button"
                                    onClick={() => handleSelectTemplate(template)}
                                    className={template.id === selectedTemplate?.id ? 'selected' : ''}
                                >
                                    <img src={template.url} alt={template.name} />
                                </button>
                            ))}
                        </S.Template>
                        {selectedTemplate && (
                            <>
                                <h2>Textos</h2>
                                <S.Form onSubmit={handleSubmit}>
                                    {(new Array(selectedTemplate.box_count)).fill('').map((_, index) => (
                                        <input
                                            key={String(Math.random())} 
                                            placeholder={`Text #${index + 1}`}
                                            onChange={handleInputChange(index)}
                                        />
                                    ))}
                                    <S.Button type="submit">MakeMyMeme</S.Button>
                                </S.Form>
                            </>
                        )}
                    </>
                )}
                </S.Card>
            
        </S.Wrapper>
    )
}