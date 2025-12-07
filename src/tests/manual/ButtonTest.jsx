// Page de test : src/tests/manual/ButtonTest.jsx
import Button from '../components/common/Button';

export default function ButtonTest() {
  return (
    <div className="p-8 space-y-4">
      <h2>Tests Button Component</h2>
      
      {/* Test variantes */}
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="success">Success</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      {/* Test tailles */}
      <div className="flex gap-4 items-center">
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </div>

      {/* Test états */}
      <div className="flex gap-4">
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>

      {/* Test icônes */}
      <div className="flex gap-4">
        <Button icon={SaveIcon}>Save</Button>
        <Button icon={TrashIcon} iconPosition="right">Delete</Button>
      </div>
    </div>
  );
}