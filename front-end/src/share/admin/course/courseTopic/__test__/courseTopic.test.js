import {render,screen,cleanup, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CourseTopic from '../index';




test('Rendering Paragraph',()=>{
    render(<CourseTopic/>);
    const footerElement=screen.getByTitle('paragraph');
    expect(footerElement).toHaveTextContent("React");
})

it('Rendering Multiple Header',async ()=>{
    render(<CourseTopic/>);
    const footerElement=await screen.findAllByRole('heading');
    expect(footerElement.length).toBe(2);
})

it('Checking Button Function', ()=>{
    render(<CourseTopic/>);
    const button= screen.getByTestId('button'); 
    fireEvent.click(button);

    const value= screen.getByTestId('value');
    expect(value).toHaveTextContent("after");
})