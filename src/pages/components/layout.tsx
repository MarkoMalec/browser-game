import React from "react";
import Sidebar from './elements/Sidebar/Sidebar.jsx';


const Layout = ({ children }: { children: React.ReactNode }) => { 
                                    // ^ Daniel => React.ReactNode specifies type  of the 'children' prop as React.ReactNode.
                                    // From googling I have found out that ReactNode is a type in react "module" that represents renderable component in React
                                    // in this case children are all components inside <Layout></Layout> (check _app.tsx)

                                    // This is kinda needed because otherwise Sidebar wont get rendered on other pages, this file is needed for 
                                    // if oyu have repeating components like header footer etc. 
    return (
        <>
            <Sidebar />
            <main className="ml-72 text-white">{children}</main>
        </>
    );
}

export default Layout;